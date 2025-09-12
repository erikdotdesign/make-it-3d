import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const loadTexture = (url?: string) => {
  if (!url) return Promise.resolve<THREE.Texture | undefined>(undefined);
  return new Promise<THREE.Texture>((resolve, reject) => {
    new THREE.TextureLoader().load(url, tex => resolve(tex), undefined, reject);
  });
};

export const createGradientTexture = (colors: string[], start: number = 0, end: number = 1) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 256, 0, 0); // bottom → top

  // bottom half = black
  if (start > 0) {
    gradient.addColorStop(0, colors[colors.length - 1]);
    gradient.addColorStop(start, colors[colors.length - 1]);
  }

  const l = colors.length;
  for (let i = 0; i < l; i++) {
    const t = i / (l - 1);
    const mapped = start + (end - start) * (1 - t);
    gradient.addColorStop(mapped, colors[i]);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, 256);

  return new THREE.CanvasTexture(canvas);
};

export const loadModel = async (url: string) => {
  return new Promise<THREE.Object3D>((resolve, reject) => {
    new GLTFLoader().load(url, gltf => {
      const model = gltf.scene;
      resolve(model);
    }, undefined, reject);
  });
};

export const applyProps = (obj: any, target: any, map: any) => {
  for (const key in obj) {
    if (obj[key] === undefined) continue;
    const setter = map[key];
    if (typeof setter === "string") {
      if (typeof target[setter] === "function") target[setter](obj[key]);
    } else if (typeof setter === "object") {
      applyProps(obj[key], target, setter);
    }
  }
};

export const disposeAndRemove = (scene: THREE.Scene, mesh?: THREE.Mesh) => {
  if (!mesh) return;
  (mesh.material as THREE.Material).dispose();
  (mesh.geometry as THREE.BufferGeometry).dispose();
  scene.remove(mesh);
};