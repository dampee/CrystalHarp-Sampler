import './style.css'
import * as Tone from 'tone'
import { SampleGenerator } from './audio/SampleGenerator'
import { SampleRenderer } from './audio/SampleRenderer'

// Initialize the application
class App {
  private sampleGenerator: SampleGenerator
  private sampleRenderer: SampleRenderer

  constructor() {
    this.sampleGenerator = new SampleGenerator()
    this.sampleRenderer = new SampleRenderer()
    
    this.init()
  }

  private async init() {
    await this.setupUI()
    await this.setupEventListeners()
  }

  private async setupUI() {
    const app = document.querySelector<HTMLDivElement>('#app')!
    app.innerHTML = `
      <div class="sample-generator">
        <header>
          <h1>� CrystalHarp Sampler</h1>
          <p>Generate high-quality audio samples with CrystalHarp</p>
        </header>
        
        <main>
          <div class="controls-section">
            <h2>CrystalHarp Synthesizer</h2>
            
            <div class="parameter-grid">
              <div class="parameter">
                <label for="attackNoise">Attack Noise</label>
                <input type="range" id="attackNoise" min="0" max="1" step="0.01" value="0.1">
                <span class="value">0.1</span>
              </div>
              
              <div class="parameter">
                <label for="dampening">Dampening</label>
                <input type="range" id="dampening" min="1000" max="10000" step="100" value="6000">
                <span class="value">6000</span>
              </div>
              
              <div class="parameter">
                <label for="resonance">Resonance</label>
                <input type="range" id="resonance" min="0" max="0.99" step="0.01" value="0.9">
                <span class="value">0.9</span>
              </div>
              
              <div class="parameter">
                <label for="release">Release</label>
                <input type="range" id="release" min="0.1" max="5" step="0.1" value="2">
                <span class="value">2</span>
              </div>
              
              <div class="parameter">
                <label for="delayTime">Delay Time</label>
                <input type="range" id="delayTime" min="0" max="1" step="0.01" value="0.25">
                <span class="value">0.25</span>
              </div>
              
              <div class="parameter">
                <label for="delayFeedback">Delay Feedback</label>
                <input type="range" id="delayFeedback" min="0" max="0.9" step="0.01" value="0.3">
                <span class="value">0.3</span>
              </div>
              
              <div class="parameter">
                <label for="volume">Output Volume</label>
                <input type="range" id="volume" min="0" max="2" step="0.1" value="1">
                <span class="value">1</span>
              </div>
            </div>
          </div>
          
          <div class="playback-section">
            <div class="control-buttons">
              <button id="startAudio" class="btn primary">🎵 Start Audio Context</button>
              <button id="playNote" class="btn" disabled>▶️ Play Note</button>
              <button id="toggleContinuous" class="btn" disabled>🔄 Continuous Play</button>
              <button id="generateAndDownload" class="btn" disabled>💾 Generate & Download Sample</button>
            </div>
            
            <div class="playback-controls">
              <div class="note-controls">
                <label for="noteSelect">Note to play:</label>
                <select id="noteSelect">
                  <option value="C4">C4</option>
                  <option value="D4">D4</option>
                  <option value="E4">E4</option>
                  <option value="F4">F4</option>
                  <option value="G4">G4</option>
                  <option value="A4">A4</option>
                  <option value="B4">B4</option>
                  <option value="C5" selected>C5</option>
                </select>
              </div>
              
              <div class="sample-length">
                <label for="sampleLength">Sample Length (seconds):</label>
                <input type="number" id="sampleLength" min="1" max="10" value="4" step="0.5">
              </div>
            </div>
            
            <div class="status">
              <span id="statusText">Ready to start</span>
            </div>
          </div>
        </main>
        
        <footer class="attribution">
          <div class="free-use">
            <h3>🎁 Free to Use</h3>
            <p>CrystalHarp Sampler is completely free! If you create something awesome with it, 
            I'd love to hear about it - drop me a line!</p>
          </div>
          <div class="source-info">
            <h3>📂 Open Source</h3>
            <p>Source code available on <a href="https://github.com/dampee/CrystalHarp-Sampler" target="_blank">GitHub</a></p>
            <p>Created by <strong>Damiaan</strong> • Built with Tone.js & TypeScript</p>
          </div>
          <div class="contact">
            <h3>💬 Get in Touch</h3>
            <p>Created something cool? Let me know! <a href="https://github.com/dampee" target="_blank">@dampee</a></p>
          </div>
        </footer>
      </div>
    `
  }

  private async setupEventListeners() {
    const startAudioBtn = document.getElementById('startAudio') as HTMLButtonElement
    const playNoteBtn = document.getElementById('playNote') as HTMLButtonElement
    const toggleContinuousBtn = document.getElementById('toggleContinuous') as HTMLButtonElement
    const generateAndDownloadBtn = document.getElementById('generateAndDownload') as HTMLButtonElement
    
    let isContinuousPlaying = false
    let continuousInterval: number | null = null
    
    // Start audio context
    startAudioBtn.addEventListener('click', async () => {
      try {
        await Tone.start()
        await this.sampleGenerator.init()
        this.updateStatus('Audio context started - ready to play!')
        
        startAudioBtn.disabled = true
        playNoteBtn.disabled = false
        toggleContinuousBtn.disabled = false
        generateAndDownloadBtn.disabled = false
        
        this.setupParameterListeners()
      } catch (error) {
        this.updateStatus('Error starting audio context: ' + error)
      }
    })

    // Play note
    playNoteBtn.addEventListener('click', () => {
      const noteSelect = document.getElementById('noteSelect') as HTMLSelectElement
      const note = noteSelect.value
      this.sampleGenerator.playNote(note)
      this.updateStatus(`Playing note: ${note}`)
    })

    // Toggle continuous play
    toggleContinuousBtn.addEventListener('click', () => {
      if (!isContinuousPlaying) {
        // Start continuous play
        const noteSelect = document.getElementById('noteSelect') as HTMLSelectElement
        const note = noteSelect.value
        
        const playWithPause = () => {
          this.sampleGenerator.playNote(note)
          this.updateStatus(`Continuous play: ${note}`)
        }
        
        // Play immediately, then every 3 seconds
        playWithPause()
        continuousInterval = window.setInterval(playWithPause, 3000)
        
        isContinuousPlaying = true
        toggleContinuousBtn.textContent = '⏹️ Stop Continuous'
        toggleContinuousBtn.classList.add('active')
      } else {
        // Stop continuous play
        if (continuousInterval) {
          clearInterval(continuousInterval)
          continuousInterval = null
        }
        isContinuousPlaying = false
        toggleContinuousBtn.textContent = '🔄 Continuous Play'
        toggleContinuousBtn.classList.remove('active')
        this.updateStatus('Continuous play stopped')
      }
    })

    // Generate and download sample (combined action)
    generateAndDownloadBtn.addEventListener('click', async () => {
      const noteSelect = document.getElementById('noteSelect') as HTMLSelectElement
      const sampleLengthInput = document.getElementById('sampleLength') as HTMLInputElement
      const note = noteSelect.value
      const duration = parseFloat(sampleLengthInput.value)
      
      try {
        generateAndDownloadBtn.disabled = true
        this.updateStatus(`Generating and preparing ${duration}s sample of ${note}...`)
        
        // Get current parameter values including volume
        const synthParams = {
          attackNoise: parseFloat((document.getElementById('attackNoise') as HTMLInputElement).value),
          dampening: parseFloat((document.getElementById('dampening') as HTMLInputElement).value),
          resonance: parseFloat((document.getElementById('resonance') as HTMLInputElement).value),
          release: parseFloat((document.getElementById('release') as HTMLInputElement).value),
          delayTime: parseFloat((document.getElementById('delayTime') as HTMLInputElement).value),
          delayFeedback: parseFloat((document.getElementById('delayFeedback') as HTMLInputElement).value),
          volume: parseFloat((document.getElementById('volume') as HTMLInputElement).value)
        }
        
        // Generate the sample using offline rendering
        const audioBlob = await this.sampleRenderer.renderSample(note, duration, synthParams)
        
        // Automatically download the sample
        const url = URL.createObjectURL(audioBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `CrystalHarp_${note}_${new Date().getTime()}.wav`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        generateAndDownloadBtn.disabled = false
        this.updateStatus(`Sample downloaded: CrystalHarp_${note}.wav`)
        
      } catch (error) {
        this.updateStatus('Error generating sample: ' + error)
        generateAndDownloadBtn.disabled = false
      }
    })
  }

  private setupParameterListeners() {
    const parameters = ['attackNoise', 'dampening', 'resonance', 'release', 'delayTime', 'delayFeedback', 'volume']
    
    parameters.forEach(param => {
      const slider = document.getElementById(param) as HTMLInputElement
      const valueSpan = slider.nextElementSibling as HTMLSpanElement
      
      slider.addEventListener('input', () => {
        const value = parseFloat(slider.value)
        valueSpan.textContent = value.toString()
        
        // Update the sample generator (volume is handled separately)
        if (param === 'volume') {
          this.sampleGenerator.updateVolume(value)
        } else {
          this.sampleGenerator.updateParameter(param, value)
        }
      })
    })
  }

  private updateStatus(message: string) {
    const statusText = document.getElementById('statusText') as HTMLSpanElement
    statusText.textContent = message
  }
}

// Start the application
new App()
