import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer, EffectPass, RenderPass, SelectiveBloomEffect } from "postprocessing";

import { disposeAndRemove } from "./utils";

import { Camera, Extrusion, State } from "../reducer";

const CAMERA_CONFIG = { fov: 75, near: 0.01, far: 1000 };

export interface RunnerOptions {
  width?: number;
  height?: number;
  controls?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export class TextViewer {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(CAMERA_CONFIG.fov, 1, CAMERA_CONFIG.near, CAMERA_CONFIG.far);
  private renderer?: THREE.WebGLRenderer;

  private composer?: EffectComposer;
  private controls?: OrbitControls;

  private bloomEffect?: SelectiveBloomEffect;

  private lightGroup = new THREE.Group();

  private text!: THREE.Mesh;

  private clock = new THREE.Clock();
  private playing = true;
  private pausedAt = 0;
  private timeOffset = 0;

  private frameId?: number;

  constructor(private host: HTMLCanvasElement, opts: RunnerOptions = {}) {
    const { 
      width = host.clientWidth, 
      height = host.clientHeight, 
      controls = true, 
      onZoomChange 
    } = opts;

    this.initRenderer(host, width, height);
    this.initCamera(width, height);
    if (controls) this.initControls(onZoomChange);
    this.initComposer(width, height);
    this.initResizeObserver();
  }

  // === Initialization Helpers ===
  private initRenderer(host: HTMLCanvasElement, width: number, height: number) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: host,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
  }


  private initCamera(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(0, 0.2, 2);
    this.camera.lookAt(0, 0, 0);
  }

  private initControls(onZoomChange?: (zoom: number) => void) {
    this.controls = new OrbitControls(this.camera, this.renderer?.domElement);
    Object.assign(this.controls, { 
      // enableDamping: true, 
      // dampingFactor: 0.1, 
      enablePan: false, 
      enableZoom: true,
      // minDistance: 0,
      // maxDistance: 1
    });
    if (onZoomChange) {
      this.controls.addEventListener("change", () => 
        onZoomChange(this.camera.position.distanceTo(this.controls!.target))
      );
    }
  }

  private initResizeObserver() {
    new ResizeObserver(() => {
      const { clientWidth: w, clientHeight: h } = this.host;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer?.setSize(w, h, false);
      this.composer?.setSize(w, h);
    }).observe(this.host);
  }

  private initComposer(width: number, height: number) {
    this.composer = new EffectComposer(this.renderer, { multisampling: 4 });
    const renderPass = new RenderPass(this.scene, this.camera);

    // this.bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, { 
    //   luminanceThreshold: 0, 
    //   intensity: 1, 
    //   radius: 0.6
    // });
    // const effectPass = new EffectPass(this.camera, this.bloomEffect);

    this.composer.addPass(renderPass);
    // this.composer.addPass(effectPass);
    this.composer.setSize(width, height);
  }

  setZoomLevel(distance: number) {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.camera.position.copy(dir.multiplyScalar(-distance));
    this.camera.updateProjectionMatrix();
  }

  setCamera(state: State) {
    this.camera.fov = state.camera.fov;
    this.camera.updateProjectionMatrix();
    this.composer?.render();
    // this.setZoomLevel(state.camera.zoom);
  }

  setLights(state: State) {
    this.scene.remove(this.lightGroup);
    this.lightGroup.clear();

    const { lighting } = state;
    const { key, fill, rim } = lighting;

    // --- Compute bounds from current text (or fallback) ---
    const bbox = this.text ? new THREE.Box3().setFromObject(this.text) : new THREE.Box3();
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());
    const radius = size.length() / 2 || 1; // fallback to 1 if empty

    const dist = radius * 2; // base multiplier for light distance

    // Base illumination
    this.lightGroup.add(new THREE.AmbientLight(0xffffff, 0.5));
    this.lightGroup.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.5));

    // Helper to attach a directional light pointing at the subject
    const makeDirLight = (color: THREE.ColorRepresentation, intensity: number, offset: THREE.Vector3) => {
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.copy(center).add(offset.multiplyScalar(dist));
      light.target.position.copy(center);
      this.lightGroup.add(light);
      this.lightGroup.add(new THREE.DirectionalLightHelper(light, 0.5, color));
      this.scene.add(light.target); // target must be in scene
      return light;
    };

    // Key / Fill / Rim lights, positioned relative to bounds
    makeDirLight(key.color, key.intensity, new THREE.Vector3(-1, 0.1, 1));   // key
    makeDirLight(fill.color, fill.intensity, new THREE.Vector3(1, 0.05, 1)); // fill
    makeDirLight(rim.color, rim.intensity, new THREE.Vector3(-1, 0.5, -1));   // rim

    this.scene.add(this.lightGroup);
  }

  private updateLights(state: State) {
    if (!this.text) return;
    this.setLights(state);
  }

  // --- Helper: center and scale a geometry ---
  private normalizeGeometry(geometry: THREE.ExtrudeGeometry, targetSize = 1) {
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const width = bbox.max.x - bbox.min.x;
    const height = bbox.max.y - bbox.min.y;
    const centerX = (bbox.max.x + bbox.min.x) / 2;
    const centerY = (bbox.max.y + bbox.min.y) / 2;

    geometry.translate(-centerX, -centerY, 0); // center
    const scale = targetSize / Math.max(width, height);
    geometry.scale(scale, scale, scale);
  }

  // --- Helper: update controls to focus on mesh ---
  private updateControls(target?: THREE.Object3D) {
    if (!this.controls || !target) return;
    const bbox = new THREE.Box3().setFromObject(target);
    const center = bbox.getCenter(new THREE.Vector3());
    this.controls.target.copy(center);
    this.controls.update();
  }

  // --- Use in setText ---
  setText(state: State) {
    disposeAndRemove(this.scene, this.text);

    const loader = new SVGLoader();
    const data = loader.parse(state.text);
    const shapes: THREE.Shape[] = data.paths.flatMap(path => path.toShapes(true));

    const geometry = new THREE.ExtrudeGeometry(shapes, {
      ...state.extrusion,
      depth: state.extrusion.depth * state.geometryScale,
      bevelThickness: state.extrusion.bevelThickness * state.geometryScale,
      bevelSize: state.extrusion.bevelSize * state.geometryScale
    });

    this.normalizeGeometry(geometry);

    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ ...state.material }));
    mesh.rotation.x = Math.PI; // flip vertically

    this.text = mesh;
    this.scene.add(this.text);
    this.updateControls(this.text);
    this.updateLights(state);
  }

  // --- Use in setTextExtrusion ---
  setTextExtrusion(state: State) {
    if (!this.text) return;

    const { extrusion, geometryScale } = state;

    const oldGeometry = this.text.geometry;
    const shapes = (oldGeometry as any).parameters.shapes;

    const newGeometry = new THREE.ExtrudeGeometry(shapes, {
      ...extrusion,
      depth: extrusion.depth * geometryScale,
      bevelThickness: extrusion.bevelThickness * geometryScale,
      bevelSize: extrusion.bevelSize * geometryScale
    });

    this.normalizeGeometry(newGeometry);

    this.text.geometry = newGeometry;
    this.updateControls(this.text);
    this.updateLights(state);

    if (oldGeometry) oldGeometry.dispose();
  }

  // === Text scene ===
  async setScene(state: State) {
    this.setText(state);
  }

  // === Animation ===
  startLoop() {
    const tick = () => {
      const elapsedTime = this.clock.getElapsedTime() - this.timeOffset;

      if (this.playing && this.controls) {
        const target = this.controls.target.clone();

        // Vector from target → camera
        const offset = this.camera.position.clone().sub(target);

        // Convert to spherical coordinates
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(offset);

        // Small concentric circular motion parameters
        const orbitRadius = THREE.MathUtils.degToRad(0.1); // horizontal circle
        const verticalAmplitude = THREE.MathUtils.degToRad(0.03); // vertical motion
        const orbitSpeed = 0.5; // radians/sec

        // Continuous circular motion
        spherical.theta += orbitRadius * Math.cos(elapsedTime * orbitSpeed); // horizontal
        spherical.phi   += verticalAmplitude * Math.sin(elapsedTime * orbitSpeed); // vertical

        // Clamp phi to avoid flipping
        const eps = 0.001;
        spherical.phi = THREE.MathUtils.clamp(spherical.phi, eps, Math.PI - eps);

        // Convert back to Cartesian and update camera
        this.camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(spherical));
        this.camera.lookAt(target);
      }

      this.controls?.update();
      this.composer?.render();
      this.frameId = requestAnimationFrame(tick);
    };

    if (!this.frameId) this.frameId = requestAnimationFrame(tick);
  }

  stopLoop(fullStop = false) {
    if (fullStop && this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = undefined;
  }

  setPlaying(state: boolean) {
    if (!state && this.playing) {
      // going into pause
      this.pausedAt = this.clock.getElapsedTime();
      this.playing = false;
    } else if (state && !this.playing) {
      // resuming
      this.timeOffset += this.clock.getElapsedTime() - this.pausedAt;
      this.playing = true;
    }
  }
}