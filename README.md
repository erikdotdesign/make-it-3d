# Synthwave Runner

**Animated and still synthwave/vaporwave renders** — directly inside Figma.  
Customize retro-futuristic scenes with background gradients, neon fog, glowing grids, palms, pillars, and a classic vaporwave sun.  

Perfect for concept art, moodboards, cover art, or adding a little nostalgia to your design files.

![cover](synthwave-runner-cover.png) 

## Features

- **1200×1200 WebM export** for animated loops  
- **1200×1200 PNG export** for still frames  
- **Smart export resizing** — match your Figma selection’s size and position  
- **Figma light/dark theme support** for the plugin UI  
- Real-time controls with play/pause toggle  

## Getting Started

1. Install **synthwave-runner** from the Figma Community  
2. Open via `Plugins → synthwave-runner`  
3. Adjust controls and export your render

## Development  

Clone this repo and run locally:  

```bash
git clone https://github.com/erikdotdesign/synthwave-runner.git
cd synthwave-runner
npm install
npm run dev
Load the manifest.json into Figma → Plugins → Development → Import plugin from manifest…
```

This plugin is built with:  
- [Three.js](https://threejs.org/) for 3D rendering  
- [Figma Plugin API](https://www.figma.com/plugin-docs/)  
- React + TypeScript 

## License 

MIT