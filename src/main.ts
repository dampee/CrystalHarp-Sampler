import './style.css'
import * as Tone from 'tone'
import { SampleGenerator } from './audio/SampleGenerator'
import { SampleRenderer } from './audio/SampleRenderer'
import { UIController } from './ui/UIController'

// Initialize the application
class App {
  private sampleGenerator: SampleGenerator
  private sampleRenderer: SampleRenderer
  private uiController: UIController

  constructor() {
    this.sampleGenerator = new SampleGenerator()
    this.sampleRenderer = new SampleRenderer()
    this.uiController = new UIController()
    
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
            </div>
          </div>
          
          <div class="playback-section">
            <div class="control-buttons">
              <button id="startAudio" class="btn primary">🎵 Start Audio Context</button>
              <button id="playNote" class="btn" disabled>▶️ Play Note</button>
              <button id="generateSample" class="btn" disabled>🎼 Generate Sample</button>
              <button id="downloadSample" class="btn" disabled>💾 Download Sample</button>
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
      </div>
    `
  }

  private async setupEventListeners() {
    const startAudioBtn = document.getElementById('startAudio') as HTMLButtonElement
    const playNoteBtn = document.getElementById('playNote') as HTMLButtonElement
    const generateSampleBtn = document.getElementById('generateSample') as HTMLButtonElement
    const downloadSampleBtn = document.getElementById('downloadSample') as HTMLButtonElement
    
    // Start audio context
    startAudioBtn.addEventListener('click', async () => {
      try {
        await Tone.start()
        await this.sampleGenerator.init()
        this.updateStatus('Audio context started - ready to play!')
        
        startAudioBtn.disabled = true
        playNoteBtn.disabled = false
        generateSampleBtn.disabled = false
        
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

    // Generate sample
    generateSampleBtn.addEventListener('click', async () => {
      const noteSelect = document.getElementById('noteSelect') as HTMLSelectElement
      const sampleLengthInput = document.getElementById('sampleLength') as HTMLInputElement
      const note = noteSelect.value
      const duration = parseFloat(sampleLengthInput.value)
      
      try {
        generateSampleBtn.disabled = true
        this.updateStatus(`Generating ${duration}s sample of ${note}...`)
        
        // Get current parameter values
        const synthParams = {
          attackNoise: parseFloat((document.getElementById('attackNoise') as HTMLInputElement).value),
          dampening: parseFloat((document.getElementById('dampening') as HTMLInputElement).value),
          resonance: parseFloat((document.getElementById('resonance') as HTMLInputElement).value),
          release: parseFloat((document.getElementById('release') as HTMLInputElement).value),
          delayTime: parseFloat((document.getElementById('delayTime') as HTMLInputElement).value),
          delayFeedback: parseFloat((document.getElementById('delayFeedback') as HTMLInputElement).value)
        }
        
        // Generate the sample using offline rendering
        const audioBlob = await this.sampleRenderer.renderSample(note, duration, synthParams)
        this.uiController.setRecordedSample(audioBlob)
        
        generateSampleBtn.disabled = false
        downloadSampleBtn.disabled = false
        this.updateStatus(`Sample generated! Ready to download.`)
        
      } catch (error) {
        this.updateStatus('Error generating sample: ' + error)
        generateSampleBtn.disabled = false
      }
    })

    // Download sample
    downloadSampleBtn.addEventListener('click', () => {
      const noteSelect = document.getElementById('noteSelect') as HTMLSelectElement
      const note = noteSelect.value
      this.uiController.downloadSample(`CrystalHarp_${note}.wav`)
      this.updateStatus('Sample downloaded!')
    })
  }

  private setupParameterListeners() {
    const parameters = ['attackNoise', 'dampening', 'resonance', 'release', 'delayTime', 'delayFeedback']
    
    parameters.forEach(param => {
      const slider = document.getElementById(param) as HTMLInputElement
      const valueSpan = slider.nextElementSibling as HTMLSpanElement
      
      slider.addEventListener('input', () => {
        const value = parseFloat(slider.value)
        valueSpan.textContent = value.toString()
        this.sampleGenerator.updateParameter(param, value)
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
