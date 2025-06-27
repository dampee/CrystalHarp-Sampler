# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context

This is a Tone.js-based sample generator project that creates audio samples for use in Ableton Live. The project focuses on:

- Creating synthesized audio samples using Tone.js
- Providing a web-based interface for parameter control
- Exporting audio samples in formats compatible with Ableton Live
- Future integration as an Ableton Live plugin (Max for Live device)

## Key Technologies

- **Tone.js**: Web Audio API library for audio synthesis
- **TypeScript**: For type-safe audio programming
- **Vite**: For fast development and building
- **Web Audio API**: For audio recording and export

## Code Style Preferences

- Use TypeScript for all audio-related code
- Follow functional programming patterns where possible
- Use async/await for audio operations
- Implement proper error handling for audio context initialization
- Use descriptive variable names for audio parameters (attack, decay, sustain, release)

## Audio Programming Guidelines

- Always check if audio context is running before starting audio
- Use Tone.start() before creating audio nodes
- Implement proper cleanup for audio resources
- Use appropriate buffer sizes for real-time audio processing
- Consider audio latency and performance optimization
