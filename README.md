# Make it 3D

Turn your Figma layers into **animated or still 3D renders** with just a few clicks.  
Extrude text, shapes, or vectors and export stunning 3D scenes directly from Figma.

![cover](make-it-3d.png) 

## Features

- **Extrusion Controls**  
  Adjust how your 2D layers become 3D:
  - Depth
  - Curve Segments
  - Bevel Thickness
  - Bevel Size
  - Bevel Segments

- **Material Controls**  
  Full PBR-style materials for realistic looks:
  - Color
  - Opacity
  - Metalness
  - Roughness
  - Transmission
  - Thickness
  - Index of Refraction (IOR)
  - Attenuation Color
  - Attenuation Distance

- **14 Material Presets**  
  Quickly apply ready-made looks:
  - Gold, Silver, Bronze  
  - Plastic, Rubber, Wood, Marble  
  - Ruby, Emerald, Sapphire, Amethyst  
  - Glass, Ice, Liquid  

- **High-Resolution Exports**  
  - 2400 × 2400 still renders (`.png`)  
  - 2400 × 2400 animated renders (`.webm`)  

- **Smart Resizing**  
  Exports auto-fit your selection’s position and size in the canvas.

- **Theme Support**  
  Plugin UI adapts to Figma’s **light and dark mode**.

## Usage

1. Select **any text, shape, or vector** in your Figma file.  
2. Open **make-it-3d** from the plugin menu.  
3. Adjust extrusion & material settings or choose a preset.  
4. Export as a **still PNG** or **animated WEBM**.  

## Perfect for

- Logos and titles with extra dimension  
- UI mockups with realistic material styles  
- Quick 3D concepts without leaving Figma  
- Animated elements for presentations and prototypes  

## Getting Started

1. Install **make-it-3d** from the Figma Community  
2. Open via `Plugins → make-it-3d`  
3. Adjust controls and export your render

## Development  

Clone this repo and run locally:  

```bash
git clone https://github.com/erikdotdesign/make-it-3d.git
cd make-it-3d
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