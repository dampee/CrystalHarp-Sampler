# Max for Live Integration Guide

This document outlines the plan for converting the Tone.js Sample Generator into an Ableton Live plugin using Max for Live.

## Current Web Application Features

### CrystalHarp Synthesizer

- **Type**: PluckSynth (string synthesis)
- **Parameters**:
  - Attack Noise: 0-1 (controls initial noise burst)
  - Dampening: 1000-10000 Hz (string dampening frequency)
  - Resonance: 0-0.99 (string resonance)
  - Release: 0.1-5 seconds (note release time)

### Effects Chain

- **Delay Effect**: FeedbackDelay
  - Delay Time: 0-1 seconds
  - Feedback: 0-0.9

### Audio Processing

- Sample rate: 44.1kHz (standard)
- Real-time parameter updates
- Audio recording and export

## Max for Live Implementation Plan

### Phase 1: Basic Synthesizer

1. **Create Max for Live device structure**

   - Device template with proper UI layout
   - Parameter mapping for Ableton Live automation
   - MIDI input handling

2. **Implement CrystalHarp algorithm**

   - Port PluckSynth algorithm to Max/MSP
   - Use `pluck~` object or implement custom algorithm
   - Match Tone.js parameter ranges and behaviors

3. **Create device interface**
   - Parameter sliders with proper scaling
   - Visual feedback for parameter changes
   - Preset management system

### Phase 2: Effects Integration

1. **Add delay effect**

   - Implement feedback delay using `tapin~`/`tapout~`
   - Parameter automation for delay time and feedback
   - Wet/dry mix control

2. **Audio routing**
   - Proper input/output handling
   - Side-chain support for modulation
   - Multiple output options

### Phase 3: Advanced Features

1. **MIDI integration**

   - Full polyphony support
   - Velocity sensitivity
   - Pitch bend and modulation wheel support

2. **Modulation system**

   - LFO modulation for parameters
   - Envelope followers
   - External modulation inputs

3. **Preset system**
   - Save/load presets within Live
   - Factory preset library
   - Morphing between presets

### Phase 4: UI Enhancement

1. **Visual design**

   - Custom UI graphics
   - Real-time waveform display
   - Parameter automation visualization

2. **Performance optimization**
   - CPU-efficient algorithms
   - Low-latency processing
   - Memory management

## Technical Specifications

### Max for Live Objects to Use

- **Audio synthesis**: `pluck~`, `noise~`, `filtergraph~`
- **Effects**: `tapin~`, `tapout~`, `comb~`
- **UI**: `live.dial`, `live.slider`, `live.button`
- **MIDI**: `notein`, `poly`, `pack`, `unpack`
- **Parameters**: `live.numbox`, `live.menu`

### Parameter Mapping

```
CrystalHarp Parameters -> Max for Live Controls:
- attackNoise (0-1) -> live.dial (float)
- dampening (1000-10000) -> live.dial (int)
- resonance (0-0.99) -> live.dial (float)
- release (0.1-5) -> live.dial (float)
- delayTime (0-1) -> live.dial (float)
- delayFeedback (0-0.9) -> live.dial (float)
```

### Audio Signal Flow

```
MIDI Input -> [poly] -> [CrystalHarp Algorithm] -> [Delay Effect] -> Audio Output
```

### File Structure

```
CrystalHarp.amxd
├── Main Device Patcher
├── Audio Processing Sub-patcher
├── UI Interface Sub-patcher
├── Preset Management Sub-patcher
└── Help Documentation
```

## Development Workflow

1. **Prototype in Max/MSP standalone**

   - Build and test core algorithm
   - Verify parameter ranges and behavior
   - Test audio quality and performance

2. **Convert to Max for Live device**

   - Add Live-specific objects and features
   - Implement parameter automation
   - Test in Live environment

3. **Testing and optimization**

   - Performance testing with complex projects
   - User interface refinement
   - Cross-platform compatibility

4. **Documentation and distribution**
   - User manual creation
   - Installation instructions
   - License and distribution setup

## Notes for Developers

- Keep parameter ranges identical to web version for consistency
- Ensure low CPU usage for real-time performance
- Test thoroughly with different MIDI controllers
- Consider making parameters modulatable for creative possibilities
- Document all parameter ranges and behaviors for users

## Resources

- [Max for Live SDK Documentation](https://docs.cycling74.com/max8/vignettes/live_object_model)
- [Ableton Live Object Model](https://docs.cycling74.com/max8/vignettes/live_object_model)
- [Max/MSP Audio Objects Reference](https://docs.cycling74.com/max8/refpages/ref-toc)

---

_This document will be updated as development progresses._
