import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer, RenderPass } from "postprocessing";
import { disposeAndRemove } from "./utils";
import { Camera, Extrusion, State } from "../reducer";

const CAMERA_CONFIG = { fov: 75, near: 0.01, far: 1000 };

export interface ViewerOptions {
  width?: number;
  height?: number;
  controls?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export class ThreeViewer {
  // --- Core ---
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.fov,
    1,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far
  );
  private renderer!: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private controls?: OrbitControls;
  private lightGroup = new THREE.Group();
  private mesh!: THREE.Mesh<THREE.ExtrudeGeometry, THREE.Material>;

  // --- Animation ---
  private clock = new THREE.Clock();
  private playing = true;
  private pausedAt = 0;
  private timeOffset = 0;
  private frameId?: number;

  constructor(private host: HTMLCanvasElement, opts: ViewerOptions = {}) {
    const { width = host.clientWidth, height = host.clientHeight, controls = true, onZoomChange } = opts;

    this.initRenderer(width, height);
    this.initCamera(width, height);
    if (controls) this.initControls(onZoomChange);
    this.initComposer(width, height);
    this.initResizeObserver();
  }

  // === Initialization ===
  private initRenderer(width: number, height: number) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.host,
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
    this.zoomToFit();
  }

  private zoomToFit(size: number = 100) {
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const margin = 1.5;
    const distance = (size / 2) / Math.tan(fov / 2) * margin;
    this.camera.position.set(0, 0, distance);
  }

  private initControls(onZoomChange?: (zoom: number) => void) {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    Object.assign(this.controls, { enablePan: false, enableZoom: true });

    if (onZoomChange) {
      this.controls.addEventListener("change", () => {
        onZoomChange(this.camera.position.distanceTo(this.controls!.target));
      });
    }
  }

  private initComposer(width: number, height: number) {
    this.composer = new EffectComposer(this.renderer, { multisampling: 4 });
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.setSize(width, height);
  }

  private initResizeObserver() {
    new ResizeObserver(() => {
      const { clientWidth: w, clientHeight: h } = this.host;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
      this.composer.setSize(w, h);
    }).observe(this.host);
  }

  // === Mesh / Material ===
  setMesh(state: State) {
    disposeAndRemove(this.scene, this.mesh);

    const shapes = new SVGLoader().parse(state.svg).paths.flatMap(p => p.toShapes(true));
    const geometry = this.centerGeometry(new THREE.ExtrudeGeometry(shapes, state.extrusion));

    this.mesh = new THREE.Mesh(geometry, this.createMaterial(geometry, state));
    this.mesh.rotation.x = Math.PI;
    this.scene.add(this.mesh);

    this.updateControls(this.mesh);
    this.setLights(state);
  }

  setExtrusion(state: State) {
    if (!this.mesh) return;

    const oldGeometry = this.mesh.geometry;
    const shapes = (oldGeometry.parameters as any).shapes as THREE.Shape[];
    const newGeometry = this.centerGeometry(new THREE.ExtrudeGeometry(shapes, state.extrusion));

    this.mesh.geometry = newGeometry;
    this.updateControls(this.mesh);
    this.setLights(state);

    if (state.material.type === "physical") this.setMaterial(state);
    oldGeometry.dispose();
  }

  setMaterial(state: State) {
    if (!this.mesh) return;

    const oldMaterial = this.mesh.material;
    this.mesh.material = this.createMaterial(this.mesh.geometry, state);
    this.mesh.material.needsUpdate = true;

    if (Array.isArray(oldMaterial)) oldMaterial.forEach(m => m.dispose());
    else oldMaterial.dispose();
  }

  private createMaterial(geometry: THREE.BufferGeometry, state: State): THREE.Material {
    const { 
      type, color, metalness, roughness, transparent,
      opacity, transmission, thickness, ior, attenuationColor,
      attenuationDistance, side 
    } = state.material;

    const threeSide = side === "double" ? THREE.DoubleSide : side === "back" ? THREE.BackSide : THREE.FrontSide;
    let finalThickness = thickness;
    let finalAttenuation = attenuationDistance;

    if (type === "physical") {
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const depth = geometry.boundingBox!.max.z - geometry.boundingBox!.min.z || 0.1;
      finalThickness = THREE.MathUtils.clamp(thickness, 0, 1) * depth;
      const factor = 0.01 + (5 - 0.01) * THREE.MathUtils.clamp(attenuationDistance, 0, 1);
      finalAttenuation = factor * Math.max(depth, 1e-6);
      return new THREE.MeshPhysicalMaterial({ 
        color, metalness, roughness, transparent, opacity, transmission,
        thickness: finalThickness, ior, attenuationColor, attenuationDistance: finalAttenuation, side: threeSide 
      });
    } else {
      return new THREE.MeshStandardMaterial({ color, metalness, roughness, transparent, opacity, side: threeSide });
    }
  }

  private centerGeometry<T extends THREE.BufferGeometry>(geometry: T) {
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const offset = new THREE.Vector3(
      (bbox.min.x + bbox.max.x) / 2,
      (bbox.min.y + bbox.max.y) / 2,
      (bbox.min.z + bbox.max.z) / 2
    );
    geometry.translate(-offset.x, -offset.y, -offset.z);
    return geometry;
  }

  private updateControls(target?: THREE.Object3D) {
    if (!this.controls || !target) return;
    const center = new THREE.Box3().setFromObject(target).getCenter(new THREE.Vector3());
    this.controls.target.copy(center);
    this.controls.update();
  }

  // === Lights ===
  setLights(state: State) {
    this.scene.remove(this.lightGroup);
    this.lightGroup.clear();

    const bbox = this.mesh ? new THREE.Box3().setFromObject(this.mesh) : new THREE.Box3();
    const center = bbox.getCenter(new THREE.Vector3());
    const radius = bbox.getSize(new THREE.Vector3()).length() / 2 || 1;
    const dist = radius * 2;

    const { key, fill, rim } = state.lighting;

    this.lightGroup.add(new THREE.AmbientLight(0xffffff, 0.5));
    this.lightGroup.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.5));

    const makeDirLight = (color: THREE.ColorRepresentation, intensity: number, offset: THREE.Vector3) => {
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.copy(center).add(offset.multiplyScalar(dist));
      light.target.position.copy(center);
      this.lightGroup.add(light);
      // this.lightGroup.add(new THREE.DirectionalLightHelper(light, 0.5, color));
      this.scene.add(light.target);
    };

    makeDirLight(key.color, key.intensity, new THREE.Vector3(-1, 0.1, 1));
    makeDirLight(fill.color, fill.intensity, new THREE.Vector3(1, 0.05, 1));
    makeDirLight(rim.color, rim.intensity, new THREE.Vector3(-1, 0.5, -1));

    this.scene.add(this.lightGroup);
  }

  // === Animation ===
  startLoop() {
    if (this.frameId) return;
    const orbitParams = { radius: 0.1, vertical: 0.03, speed: 0.5 };

    const tick = () => {
      const elapsed = this.clock.getElapsedTime() - this.timeOffset;
      if (this.playing && this.controls) this.updateCameraOrbit(elapsed, orbitParams);
      this.controls?.update();
      this.composer?.render();
      this.frameId = requestAnimationFrame(tick);
    };
    this.frameId = requestAnimationFrame(tick);
  }

  stopLoop(fullStop = false) {
    if (fullStop && this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = undefined;
  }

  setPlaying(state: boolean) {
    if (state === this.playing) return;
    if (!state) this.pausedAt = this.clock.getElapsedTime();
    else this.timeOffset += this.clock.getElapsedTime() - this.pausedAt;
    this.playing = state;
  }

  private updateCameraOrbit(elapsed: number, params: { radius: number; vertical: number; speed: number }) {
    const target = this.controls!.target.clone();
    const offset = this.camera.position.clone().sub(target);
    const spherical = new THREE.Spherical().setFromVector3(offset);

    spherical.theta += THREE.MathUtils.degToRad(params.radius) * Math.cos(elapsed * params.speed);
    spherical.phi += THREE.MathUtils.degToRad(params.vertical) * Math.sin(elapsed * params.speed);
    spherical.phi = THREE.MathUtils.clamp(spherical.phi, 0.001, Math.PI - 0.001);

    this.camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(spherical));
    this.camera.lookAt(target);
  }

  setScene(state: State) { 
    this.setMesh(state); 
  }

  setCamera(state: State) { 
    this.camera.fov = state.camera.fov;
    this.camera.updateProjectionMatrix(); 
    this.composer?.render(); 
  }
}