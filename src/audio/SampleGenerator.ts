import * as Tone from 'tone'

/**
 * Custom deterministic PluckSynth implementation
 * This recreates the Karplus-Strong algorithm with a deterministic noise source
 */
class DeterministicPluckSynth {
  private _noiseBuffer: Tone.ToneAudioBuffer
  private _noiseSource: Tone.ToneBufferSource | null = null
  private _lfcf: Tone.LowpassCombFilter
  private _gain: Tone.Gain
  private _isDisposed: boolean = false
  
  public attackNoise: number
  public resonance: number
  public release: number

  constructor(options: any = {}) {
    // Create a gain node for output
    this._gain = new Tone.Gain(1)
    
    // Create deterministic noise buffer
    this._noiseBuffer = this._createDeterministicNoiseBuffer()
    
    // Create lowpass comb filter (same as PluckSynth)
    this._lfcf = new Tone.LowpassCombFilter({
      dampening: options.dampening || 4000,
      resonance: options.resonance || 0.7,
    })

    this.attackNoise = options.attackNoise || 1
    this.resonance = options.resonance || 0.7
    this.release = options.release || 1

    // Connect the chain: noise -> filter -> output
    this._lfcf.connect(this._gain)
  }

  private _createDeterministicNoiseBuffer(): Tone.ToneAudioBuffer {
    // Create a deterministic pink noise buffer
    const bufferLength = 44100 * 2 // 2 seconds at 44.1kHz
    const channels = 2
    const buffer: Float32Array[] = []
    
    // Generate noise once and use for both channels to ensure identical stereo
    const masterChannel = new Float32Array(bufferLength)
    let seed = 12345 // Fixed seed for deterministic noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    
    for (let i = 0; i < bufferLength; i++) {
      // Linear congruential generator for deterministic "random" values
      seed = (seed * 1664525 + 1013904223) % Math.pow(2, 32)
      const white = (seed / Math.pow(2, 32)) * 2 - 1
      
      // Pink noise filter (same algorithm as Tone.js)
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      masterChannel[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      masterChannel[i] *= 0.11 // Gain compensation
      b6 = white * 0.115926
    }
    
    // Copy the same data to both channels for identical stereo
    for (let channelNum = 0; channelNum < channels; channelNum++) {
      buffer[channelNum] = masterChannel.slice() // Copy the master channel
    }
    
    return new Tone.ToneAudioBuffer().fromArray(buffer)
  }

  get dampening(): number {
    return this._lfcf.dampening as number
  }

  set dampening(fq: number) {
    this._lfcf.dampening = fq
  }

  connect(destination: any): this {
    this._gain.connect(destination)
    return this
  }

  disconnect(): void {
    this._gain.disconnect()
  }

  triggerAttack(note: string | number, time?: number): this {
    if (this._isDisposed) return this
    
    const freq = typeof note === 'string' ? Tone.Frequency(note).toFrequency() : note
    const computedTime = time || Tone.now()
    const delayAmount = 1 / freq
    
    // Set delay time based on frequency (same as PluckSynth)
    this._lfcf.delayTime.setValueAtTime(delayAmount, computedTime)
    
    // Configure resonance with immediate decay based on release parameter
    this._lfcf.resonance.cancelScheduledValues(computedTime)
    this._lfcf.resonance.setValueAtTime(this.resonance, computedTime)
    
    // Start decay immediately after the noise burst ends
    const attackDuration = delayAmount * this.attackNoise
    const decayStartTime = computedTime + attackDuration
    
    // Apply release decay - shorter release = faster decay
    // Convert release to a decay time that makes sense for pluck sounds
    const decayTime = this.release * 2 // Scale release to reasonable decay duration
    this._lfcf.resonance.exponentialRampTo(0.01, decayTime, decayStartTime)
    
    // Stop any existing noise source
    if (this._noiseSource) {
      this._noiseSource.stop(computedTime)
      this._noiseSource.dispose()
    }
    
    // Create new deterministic noise source - always starts at position 0
    this._noiseSource = new Tone.ToneBufferSource({
      url: this._noiseBuffer,
      loop: false,
    }).connect(this._lfcf)
    
    // Start the noise burst at a fixed position (no randomness!)
    this._noiseSource.start(computedTime, 0) // Always start at position 0
    this._noiseSource.stop(computedTime + attackDuration)
    
    return this
  }

  triggerRelease(time?: number): this {
    if (this._isDisposed) return this
    
    const computedTime = time || Tone.now()
    console.log(`DeterministicPluckSynth triggerRelease: time=${computedTime}, release=${this.release}`)
    
    // Cancel any existing ramps and start immediate decay
    this._lfcf.resonance.cancelScheduledValues(computedTime)
    
    // Get current resonance value and ramp down from there
    const currentResonance = this._lfcf.resonance.value
    this._lfcf.resonance.setValueAtTime(currentResonance, computedTime)
    this._lfcf.resonance.exponentialRampTo(0.01, this.release * 2, computedTime)
    
    return this
  }

  triggerAttackRelease(note: string | number, _duration: string | number, time?: number, _velocity: number = 1): this {
    const computedTime = time || Tone.now()
    
    // For pluck sounds, the attack handles the entire envelope including decay
    // The _duration parameter is not used for plucks as they have natural decay
    this.triggerAttack(note, computedTime)
    
    // Note: _velocity is currently not used in PluckSynth, but kept for API compatibility
    // In a full implementation, velocity could affect attackNoise or resonance
    
    return this
  }

  dispose(): void {
    if (this._isDisposed) return
    
    if (this._noiseSource) {
      this._noiseSource.dispose()
      this._noiseSource = null
    }
    this._noiseBuffer.dispose()
    this._lfcf.dispose()
    this._gain.dispose()
    this._isDisposed = true
  }
}

export class SampleGenerator {
  private crystalHarp: Tone.PluckSynth | DeterministicPluckSynth
  private delay: Tone.FeedbackDelay
  private gainNode: Tone.Gain
  private isInitialized: boolean = false
  private isConsistentMode: boolean = true // Default to consistent mode
  private currentParams: any = {}

  constructor() {
    // Initialize delay effect with feedback
    this.delay = new Tone.FeedbackDelay({
      delayTime: 0.25,
      feedback: 0.3,
      wet: 0.3
    })

    // Initialize gain node for volume control
    this.gainNode = new Tone.Gain(1).toDestination()
    this.delay.connect(this.gainNode)

    // Store initial parameters
    this.currentParams = {
      attackNoise: 0.1,
      dampening: 6000,
      resonance: 0.9,
      release: 2,
    }

    // Initialize CrystalHarp synthesizer with DeterministicPluckSynth by default (consistent mode)
    this.crystalHarp = new DeterministicPluckSynth(this.currentParams).connect(this.delay)
  }

  async init(): Promise<void> {
    if (this.isInitialized) return
    
    // Ensure audio context is running
    if (Tone.context.state !== 'running') {
      await Tone.start()
    }
    
    this.isInitialized = true
  }

  setConsistentMode(enabled: boolean): void {
    if (!this.isInitialized) return
    
    this.isConsistentMode = enabled
    
    // Disconnect and dispose current synth
    this.crystalHarp.disconnect()
    this.crystalHarp.dispose()
    
    if (this.isConsistentMode) {
      // Use our custom deterministic PluckSynth
      this.crystalHarp = new DeterministicPluckSynth(this.currentParams).connect(this.delay)
      console.log('Consistent mode enabled - using DeterministicPluckSynth')
    } else {
      // Use regular PluckSynth for natural variation
      this.crystalHarp = new Tone.PluckSynth(this.currentParams).connect(this.delay)
      console.log('Consistent mode disabled - using PluckSynth with natural variation')
    }
  }

  getIsConsistentMode(): boolean {
    return this.isConsistentMode
  }

  playNote(note: string, duration: string = '4n'): void {
    if (!this.isInitialized) {
      throw new Error('SampleGenerator not initialized. Call init() first.')
    }
    
    // For consistent playback, we reset the synth state
    // This ensures identical sound every time
    this.crystalHarp.triggerAttackRelease(note, duration)
  }

  updateParameter(paramName: string, value: number): void {
    if (!this.isInitialized) return

    // Store parameter value
    this.currentParams[paramName] = value

    // Apply parameter to current synth
    if (this.crystalHarp instanceof DeterministicPluckSynth) {
      // DeterministicPluckSynth parameters
      switch (paramName) {
        case 'attackNoise':
          this.crystalHarp.attackNoise = value
          break
        case 'dampening':
          this.crystalHarp.dampening = value
          break
        case 'resonance':
          this.crystalHarp.resonance = value
          break
        case 'release':
          this.crystalHarp.release = value
          console.log(`Updated DeterministicPluckSynth release to: ${value}`)
          break
      }
    } else if (this.crystalHarp instanceof Tone.PluckSynth) {
      // PluckSynth parameters
      switch (paramName) {
        case 'attackNoise':
          this.crystalHarp.attackNoise = value
          break
        case 'dampening':
          this.crystalHarp.dampening = value
          break
        case 'resonance':
          this.crystalHarp.resonance = value
          break
        case 'release':
          this.crystalHarp.release = value
          break
      }
    }

    // Delay parameters work for both synth types
    switch (paramName) {
      case 'delayTime':
        this.delay.delayTime.value = value
        break
      case 'delayFeedback':
        this.delay.feedback.value = value
        break
    }
  }

  updateVolume(value: number): void {
    if (!this.isInitialized) return
    this.gainNode.gain.value = value
  }

  getSynth(): Tone.PluckSynth | DeterministicPluckSynth {
    return this.crystalHarp
  }

  getDelay(): Tone.FeedbackDelay {
    return this.delay
  }

  dispose(): void {
    this.crystalHarp.dispose()
    this.delay.dispose()
    this.gainNode.dispose()
    this.isInitialized = false
  }
}
