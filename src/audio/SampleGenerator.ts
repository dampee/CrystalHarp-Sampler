import * as Tone from 'tone'

export class SampleGenerator {
  private crystalHarp: Tone.PluckSynth
  private delay: Tone.FeedbackDelay
  private isInitialized: boolean = false

  constructor() {
    // Initialize delay effect with feedback
    this.delay = new Tone.FeedbackDelay({
      delayTime: 0.25,
      feedback: 0.3,
      wet: 0.3
    }).toDestination()

    // Initialize CrystalHarp synthesizer as provided by user
    this.crystalHarp = new Tone.PluckSynth({
      attackNoise: 0.1,
      dampening: 6000,
      resonance: 0.9,
      release: 2,
    }).connect(this.delay)
  }

  async init(): Promise<void> {
    if (this.isInitialized) return
    
    // Ensure audio context is running
    if (Tone.context.state !== 'running') {
      await Tone.start()
    }
    
    this.isInitialized = true
  }

  playNote(note: string, duration: string = '4n'): void {
    if (!this.isInitialized) {
      throw new Error('SampleGenerator not initialized. Call init() first.')
    }
    
    this.crystalHarp.triggerAttackRelease(note, duration)
  }

  updateParameter(paramName: string, value: number): void {
    if (!this.isInitialized) return

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
      case 'delayTime':
        this.delay.delayTime.value = value
        break
      case 'delayFeedback':
        this.delay.feedback.value = value
        break
      default:
        console.warn(`Unknown parameter: ${paramName}`)
    }
  }

  getSynth(): Tone.PluckSynth {
    return this.crystalHarp
  }

  getDelay(): Tone.FeedbackDelay {
    return this.delay
  }

  dispose(): void {
    this.crystalHarp.dispose()
    this.delay.dispose()
    this.isInitialized = false
  }
}
