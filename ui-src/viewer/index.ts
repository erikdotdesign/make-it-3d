import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer, EffectPass, RenderPass, SelectiveBloomEffect } from "postprocessing";

import { disposeAndRemove } from "./utils";

import { State } from "../reducer";

const CAMERA_CONFIG = { fov: 50, near: 0.01, far: 1000 };

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

  private text: THREE.Mesh;

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
    this.initLights();
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
      enableDamping: true, 
      dampingFactor: 0.1, 
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

    this.bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, { 
      luminanceThreshold: 0, 
      intensity: 1, 
      radius: 0.6
    });
    const effectPass = new EffectPass(this.camera, this.bloomEffect);

    this.composer.addPass(renderPass);
    this.composer.addPass(effectPass);
    this.composer.setSize(width, height);
  }

  private initLights() {
    // Base illumination
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Main directional light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 10, 5);
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
    rimLight.position.set(0, 5, -5);
    this.scene.add(rimLight);
  }

  setZoomLevel(distance: number) {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.camera.position.copy(dir.multiplyScalar(-distance));
    this.camera.updateProjectionMatrix();
  }

  setText(state: State) {
    disposeAndRemove(this.scene, this.text);

    const loader = new SVGLoader();
    const data = loader.parse(state.text);
    const shapes = data.paths.flatMap(p => p.toShapes(true));

    if (shapes.length === 0) return;

    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: 3,      // deeper extrusion
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.02
    });

    geometry.scale(0.01, 0.01, 0.01); // scale only
    geometry.center();                 // center in origin

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );

    mesh.rotation.x = Math.PI;

    this.text = mesh;
    this.scene.add(this.text);
  }

  // === Text scene ===
  async setScene(state: State) {
    this.setText(state);
  }

  // === Animation ===
  startLoop() {
    const tick = () => {
      const elapsedTime = this.clock.getElapsedTime() - this.timeOffset;
      this.controls?.update();

      if (this.playing) {
        const scrollSpeed = 1; // units per second
      }

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