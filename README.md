# 🎹 CrystalHarp Sampler

A modern web-based sample generator built with Tone.js and TypeScript. This project features the CrystalHarp synthesizer and provides real-time parameter control with offline audio rendering capabilities. CrystalHarp Sampler

A modern web-based sample generator built with Tone.js and TypeScript, designed for creating audio samples compatible with Ableton Live. This project features the CrystalHarp synthesizer and provides real-time parameter control with offline audio rendering capabilities.

## 🌐 Live Demo

**[Try CrystalHarp Sampler](https://dampee.github.io/CrystalHarp-Sampler)** 🎵

## ✨ Features

- **🎹 CrystalHarp Synthesizer**: Beautiful pluck synthesizer with configurable parameters
- **🔧 Real-time Parameter Control**: Interactive sliders for tweaking sound parameters
- **🎚️ Effect Processing**: Built-in delay effect with feedback control
- **🎼 Offline Sample Generation**: Generate perfect quality samples using Tone.js offline rendering
- **💾 Sample Export**: Download samples as WAV files for use in music production
- **🎨 Modern UI**: Beautiful, responsive interface with dark theme
- **🚀 Fast Development**: Built with Vite for lightning-fast hot reload

## 🛠️ Technologies

- **Tone.js** - Web Audio API synthesis library
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **CSS Custom Properties** - Modern styling with CSS variables
- **Web Audio API** - Native browser audio processing

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd CrystalHarp-Sampler
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🌐 Live Demo

**[Try the live application on GitHub Pages!](https://dampee.github.io/CrystalHarp-Sampler)**

## 🚀 Deploy to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

1. **Fork or clone** this repository
2. **Update URLs** in `package.json` with your GitHub username
3. **Push to GitHub** and enable GitHub Pages in repository settings
4. **Automatic deployment** via GitHub Actions

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy Commands

```bash
# Manual deployment (after setup)
npm run deploy

# Or push to main branch for automatic deployment
git push origin main
```

## 🎛️ Usage

1. **Start Audio Context**: Click the "Start Audio Context" button to initialize the audio system
2. **Adjust Parameters**: Use the sliders to modify the CrystalHarp synthesizer parameters:
   - **Attack Noise**: Controls the initial noise burst (0-1)
   - **Dampening**: Controls string dampening frequency (1000-10000 Hz)
   - **Resonance**: Controls string resonance (0-0.99)
   - **Release**: Controls note release time (0.1-5 seconds)
   - **Delay Time**: Controls delay effect timing (0-1 seconds)
   - **Delay Feedback**: Controls delay feedback amount (0-0.9)
3. **Play Notes**: Select a note and click "Play Note" to hear the current sound
4. **Generate Samples**: Set sample length and click "Generate Sample" to create audio using offline rendering
5. **Download**: Click "Download Sample" to save the generated audio file (.wav format)

## 🎹 CrystalHarp Synthesizer

The CrystalHarp is based on Tone.js's PluckSynth with carefully tuned parameters:

```typescript
const crystalHarp = new Tone.PluckSynth({
  attackNoise: 0.1,
  dampening: 6000,
  resonance: 0.9,
  release: 2,
}).connect(delay);
```

This creates a beautiful, crystalline harp-like sound perfect for ambient music, sound design, and musical production.

## 🏗️ Project Structure

```
src/
├── audio/
│   ├── SampleGenerator.ts    # Main synthesizer class
│   └── AudioRecorder.ts      # Audio recording functionality
├── ui/
│   └── UIController.ts       # UI interaction handling
├── main.ts                   # Application entry point
└── style.css                 # Modern UI styles
```

## 🎯 Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari (partial - some recording features may be limited)
- Edge

**Note**: Audio recording requires modern browser support for MediaRecorder API and getUserMedia/getDisplayMedia.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tone.js** team for the amazing Web Audio library
- The web audio community for pushing the boundaries of browser-based audio

## 🐛 Known Issues

- Audio recording may require user permission for microphone access
- Some browsers may not support all audio recording features
- Sample quality depends on browser's audio processing capabilities

## 📧 Contact

For questions, suggestions, or collaboration opportunities, please open an issue on GitHub.

---

_Built with ❤️ for music producers and sound designers_
