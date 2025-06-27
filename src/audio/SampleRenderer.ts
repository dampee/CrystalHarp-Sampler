import * as Tone from 'tone'

export class SampleRenderer {
  constructor() {}

  async renderSample(
    note: string, 
    duration: number, 
    synthParams: {
      attackNoise: number,
      dampening: number,
      resonance: number,
      release: number,
      delayTime: number,
      delayFeedback: number
    }
  ): Promise<Blob> {
    try {
      // Use Tone.js offline rendering
      const audioBuffer = await Tone.Offline(({ transport }) => {
        // Create delay effect
        const delay = new Tone.FeedbackDelay({
          delayTime: synthParams.delayTime,
          feedback: synthParams.delayFeedback,
          wet: 0.3
        }).toDestination()

        // Create CrystalHarp synthesizer with current parameters
        const crystalHarp = new Tone.PluckSynth({
          attackNoise: synthParams.attackNoise,
          dampening: synthParams.dampening,
          resonance: synthParams.resonance,
          release: synthParams.release,
        }).connect(delay)

        // Schedule the note to play
        crystalHarp.triggerAttackRelease(note, duration, 0)
        
        // Start transport
        transport.start()
        
      }, duration)

      // Convert ToneAudioBuffer to WAV blob
      const wavBlob = this.audioBufferToWav(audioBuffer.get() as AudioBuffer)
      return wavBlob
      
    } catch (error) {
      throw new Error(`Failed to render sample: ${error}`)
    }
  }

  private audioBufferToWav(audioBuffer: AudioBuffer): Blob {
    const length = audioBuffer.length
    const numberOfChannels = audioBuffer.numberOfChannels
    const sampleRate = audioBuffer.sampleRate
    
    // Calculate buffer size for WAV file
    const bufferLength = 44 + length * numberOfChannels * 2
    const arrayBuffer = new ArrayBuffer(bufferLength)
    const view = new DataView(arrayBuffer)
    
    // WAV file header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    
    const writeUint32 = (offset: number, value: number) => {
      view.setUint32(offset, value, true)
    }
    
    const writeUint16 = (offset: number, value: number) => {
      view.setUint16(offset, value, true)
    }
    
    // RIFF chunk descriptor
    writeString(0, 'RIFF')
    writeUint32(4, bufferLength - 8)
    writeString(8, 'WAVE')
    
    // fmt sub-chunk
    writeString(12, 'fmt ')
    writeUint32(16, 16) // Sub-chunk size
    writeUint16(20, 1)  // Audio format (PCM)
    writeUint16(22, numberOfChannels)
    writeUint32(24, sampleRate)
    writeUint32(28, sampleRate * numberOfChannels * 2) // Byte rate
    writeUint16(32, numberOfChannels * 2) // Block align
    writeUint16(34, 16) // Bits per sample
    
    // data sub-chunk
    writeString(36, 'data')
    writeUint32(40, length * numberOfChannels * 2)
    
    // Convert audio data to 16-bit PCM
    let offset = 44
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]))
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
        view.setInt16(offset, intSample, true)
        offset += 2
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }
}
