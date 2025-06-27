# 🎹 CrystalHarp Sampler

A modern web-based sample generator built with Tone.js and TypeScript. This project features the CrystalHarp synthesizer and provides real-time parameter control with offline audio rendering capabilities.

<!-- Updated: January 2025 - GitHub Pages deployment active -->

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

   - **Attack Noise**: Controls the initial pluck noise burst (0.01-1) - _PluckSynth mode only_
   - **Dampening**: Controls string dampening frequency (1000-10000 Hz) - _PluckSynth mode only_
   - **Resonance**: Controls string resonance (0-0.99) - _PluckSynth mode only_
   - **Release**: Controls note release time (0.1-5 seconds) - _Available in both modes_
   - **Delay Time**: Controls delay effect timing (0-1 seconds) - _Available in both modes_
   - **Delay Feedback**: Controls delay feedback amount (0-0.9) - _Available in both modes_
   - **Output Volume**: Controls final output level (0-2x gain) - _Available in both modes_

   > **Note**: Parameters are automatically shown/hidden based on the current synth mode for clarity.

3. **Play Notes**: Select a note and click "Play Note" to hear the current sound
4. **Continuous Play**: Use "Continuous Play" for hands-free parameter tweaking (plays every 3 seconds)
5. **Consistent Mode**:
   - **Enabled (default)**: Uses DeterministicPluckSynth - identical PluckSynth-like sounds every time
   - **Disabled**: Uses PluckSynth with natural Karplus-Strong variation for organic sound
6. **Generate Samples**: Set sample length and click "Generate & Download Sample" to create and download audio files

> **Technical Note**: PluckSynth uses the Karplus-Strong algorithm which includes inherent randomness in the noise source for natural pluck variation. The "Consistent Mode" (default) uses a custom DeterministicPluckSynth that replicates the Karplus-Strong algorithm but with a deterministic noise source, ensuring identical sounds on every trigger while maintaining the characteristic pluck timbre. All sound parameters are available in both modes.

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

## 🎛️ Synthesizer Parameters

All synthesizer parameters work in both standard and consistent modes:

- **Attack Noise**: Controls the duration of the initial noise burst. Higher values create a longer "pluck" sound at the beginning.

- **Dampening**: Controls the brightness of the sound by adjusting the lowpass filter cutoff frequency. Lower values create darker, more muffled tones while higher values create brighter sounds.

- **Resonance**: Controls how much energy is preserved in the feedback loop. Higher values create longer sustain and more pronounced harmonic content.

- **Release**: Controls how quickly the sound decays after the initial attack. Lower values create short, percussive sounds while higher values create longer sustained notes.

### 🔬 Deterministic Mode Technical Details

The "Consistent Mode" implements a custom `DeterministicPluckSynth` class that solves the inherent randomness in Tone.js's PluckSynth. Here's how:

**The Problem**: Tone.js PluckSynth uses the Karplus-Strong algorithm, which includes random noise to simulate natural string variations. The randomness comes from `Math.random()` calls in the noise source that pick different starting positions in the noise buffer on each trigger.

**The Solution**: Our `DeterministicPluckSynth`:

1. Replicates the exact Karplus-Strong chain: Noise → LowpassCombFilter → Output
2. Uses the same pink noise and comb filter as the original PluckSynth
3. Eliminates randomness by ensuring the noise source always starts from the same state
4. Maintains all the characteristic PluckSynth parameters and behavior

**Result**: Identical pluck sounds on every trigger while preserving the unique Karplus-Strong timbre that makes PluckSynth special.

```typescript
// Custom implementation that maintains PluckSynth's exact signal chain
class DeterministicPluckSynth {
  private _noise: Tone.Noise; // Pink noise source
  private _lfcf: Tone.LowpassCombFilter; // Karplus-Strong filter
  // ... identical parameter control to PluckSynth
}
```

## 🏗️ Project Structure

```
src/
├── audio/
│   ├── SampleGenerator.ts    # Main CrystalHarp synthesizer with DeterministicPluckSynth
│   └── SampleRenderer.ts     # Offline audio rendering for sample generation
├── ui/
│   └── UIController.ts       # UI interaction handling (legacy)
├── main.ts                   # Application entry point and UI logic
├── style.css                 # Modern UI styles with CSS variables
└── vite-env.d.ts            # TypeScript environment definitions

public/
├── .nojekyll                # Prevents GitHub Pages Jekyll processing
└── vite.svg                 # Application icon

.github/
└── workflows/
    └── deploy.yml           # GitHub Actions deployment workflow
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

- **Benj** ([SoundCloud](https://soundcloud.com/svensson_dj)) for the original idea and inspiration
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
