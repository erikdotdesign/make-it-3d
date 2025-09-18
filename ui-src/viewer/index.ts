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
  private mesh: THREE.Mesh<THREE.ExtrudeGeometry, THREE.Material> | null = null;

  // --- Animation ---
  private clock = new THREE.Clock();
  private playing = true;
  private pausedAt = 0;
  private timeOffset = 0;
  private frameId?: number;
  private startPosition = new THREE.Vector3();
  private _offsetVector = new THREE.Vector3();
  private _spherical = new THREE.Spherical();

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
      preserveDrawingBuffer: true
    });
    this.renderer.shadowMap.enabled = true;
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
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = true;
    this.controls.enableZoom = true;

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
  public setMesh(state: State) {
    if (this.mesh) disposeAndRemove(this.scene, this.mesh);

    const shapes = new SVGLoader().parse(state.svg).paths.flatMap(p => p.toShapes(true));
    const geometry = this.centerGeometry(new THREE.ExtrudeGeometry(shapes, state.extrusion));

    this.mesh = new THREE.Mesh(geometry, this.createMaterial(geometry, state));
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.rotation.x = Math.PI;
    this.scene.add(this.mesh);

    this.updateScene(state);
  }

  public setExtrusion(state: State) {
    if (!this.mesh) return;

    const oldGeometry = this.mesh.geometry;
    const shapes = (oldGeometry.parameters as any).shapes as THREE.Shape[];
    this.mesh.geometry = this.centerGeometry(new THREE.ExtrudeGeometry(shapes, state.extrusion));
    oldGeometry.dispose();

    this.updateScene(state);
  }

  public setMaterial(state: State) {
    if (!this.mesh) return;

    const oldMaterial = this.mesh.material;
    this.mesh.material = this.createMaterial(this.mesh.geometry, state);
    this.mesh.material.needsUpdate = true;

    if (Array.isArray(oldMaterial)) oldMaterial.forEach(m => m.dispose());
    else oldMaterial.dispose();
  }

  private createMaterial(geometry: THREE.BufferGeometry, state: State): THREE.Material {
    const { 
      type, color, emissive, emissiveIntensity, metalness, roughness, transparent,
      opacity, transmission, thickness, ior, attenuationColor, attenuationDistance, side 
    } = state.material;

    const threeSide = side === "double" ? THREE.DoubleSide : side === "back" ? THREE.BackSide : THREE.FrontSide;

    if (type === "physical") {
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const depth = geometry.boundingBox!.max.z - geometry.boundingBox!.min.z || 0.1;

      // Ensure thickness is never 0
      const safeThickness = THREE.MathUtils.clamp(thickness, 1e-6, 1);  
      const finalThickness = safeThickness * depth;

      const factor = 0.01 + (5 - 0.01) * THREE.MathUtils.clamp(attenuationDistance, 0, 1);
      const finalAttenuation = factor * Math.max(depth, 1e-6);

      return new THREE.MeshPhysicalMaterial({
        color,
        emissive, 
        emissiveIntensity,
        metalness,
        roughness,
        transparent,
        opacity,
        transmission,
        thickness: finalThickness,
        ior,
        attenuationColor,
        attenuationDistance: finalAttenuation,
        side: threeSide,
      });
    } else {
      return new THREE.MeshStandardMaterial({
        color,
        emissive, 
        emissiveIntensity,
        metalness,
        roughness,
        transparent,
        opacity,
        side: threeSide,
      });
    }
  }

  private centerGeometry<T extends THREE.BufferGeometry>(geometry: T) {
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const offset = new THREE.Vector3().addVectors(bbox.min, bbox.max).multiplyScalar(0.5);
    geometry.translate(-offset.x, -offset.y, -offset.z);
    return geometry;
  }

  private getBoundingBox(object: THREE.Object3D) {
    const bbox = new THREE.Box3().setFromObject(object);
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());
    return { bbox, center, size };
  }

  private zoomToFit(padding: number = 1.2) {
    if (!this.mesh) return;
    const { center, size } = this.getBoundingBox(this.mesh);

    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const aspect = this.camera.aspect;

    const distY = (size.y / 2) / Math.tan(fov / 2);
    const distX = (size.x / 2) / (Math.tan(fov / 2) * aspect);
    let distance = Math.max(distX, distY) + size.z / 2;

    distance *= padding;
    this.camera.position.copy(center).add(new THREE.Vector3(0, 0, distance));
    this.camera.lookAt(center);

    if (this.controls) {
      this.controls.target.copy(center);
      this.controls.update();
    }
  }

  private updateControls(target?: THREE.Object3D) {
    if (!this.controls || !target) return;
    const { center } = this.getBoundingBox(target);
    this.controls.target.copy(center);
    this.controls.update();
  }

  // === Lights ===
  public setLights(state: State) {
    // Clear previous lights/helpers
    this.lightGroup.clear();
    this.scene.add(this.lightGroup);

    if (!this.mesh) return;

    const { center, size } = this.getBoundingBox(this.mesh);
    const radius = Math.max(size.x, size.y, size.z) / 2; // bounding radius includes Z

    const { key, fill, rim } = state.lighting;

    // Ambient + hemisphere
    this.lightGroup.add(new THREE.AmbientLight(0xffffff, 0.2));
    this.lightGroup.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.5));

    // Helper to create directional lights
    const addDirLight = (
      color: THREE.ColorRepresentation,
      intensity: number,
      offset: THREE.Vector3,
      castShadow = false
    ) => {
      const light = new THREE.DirectionalLight(color, intensity);

      // Scale offset relative to radius
      const adjustedOffset = offset.clone().multiplyScalar(radius * 2);
      light.position.copy(center).add(adjustedOffset);
      light.target.position.copy(center);

      light.castShadow = castShadow;
      if (castShadow) {
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.bias = -0.001;
      }

      this.lightGroup.add(light);
      this.scene.add(light.target);

      // Helper for debugging
      // const helper = new THREE.DirectionalLightHelper(light, radius * 0.5, light.color);
      // this.lightGroup.add(helper);
    };

    addDirLight(key.color, key.intensity, new THREE.Vector3(-0.5, 0.4, 1), false);
    addDirLight(fill.color, fill.intensity, new THREE.Vector3(0.5, 0.4, 1), false);
    addDirLight(rim.color, rim.intensity, new THREE.Vector3(-1, 0.4, -1), false);
    addDirLight(rim.color, rim.intensity, new THREE.Vector3(1, 0.4, -1), false);
  }

  // === Animation ===
  public startLoop() {
    if (this.frameId) cancelAnimationFrame(this.frameId);

    const orbitParams = { radius: 0.2, vertical: 0.03, speed: 0.5 };

    const tick = () => {
      const elapsed = this.clock.getElapsedTime() - this.timeOffset;
      if (this.playing && this.controls) this.updateCameraOrbit(elapsed, orbitParams);
      this.controls?.update();
      this.composer?.render();
      this.frameId = requestAnimationFrame(tick);
    };
    this.frameId = requestAnimationFrame(tick);
  }

  public stopLoop(fullStop = false) {
    if (fullStop && this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = undefined;
  }

  public setPlaying(state: boolean) {
    if (state === this.playing) return;
    if (!state) this.pausedAt = this.clock.getElapsedTime();
    else this.timeOffset += this.clock.getElapsedTime() - this.pausedAt;
    this.playing = state;
  }

  private initCameraOrbit() {
    this.startPosition.copy(this.camera.position);
    this.clock = new THREE.Clock();
    this.timeOffset = 0;
    this.pausedAt = 0;
  }

  private updateCameraOrbit(elapsed: number, params: { radius: number; vertical: number; speed: number }) {
    if (!this.controls) return;

    const target = this.controls.target;
    this._offsetVector.subVectors(this.camera.position, target);
    this._spherical.setFromVector3(this._offsetVector);

    this._spherical.theta += THREE.MathUtils.degToRad(params.radius) * Math.cos(elapsed * params.speed);
    this._spherical.phi += THREE.MathUtils.degToRad(params.vertical) * Math.sin(elapsed * params.speed);
    this._spherical.phi = THREE.MathUtils.clamp(this._spherical.phi, 0.001, Math.PI - 0.001);

    this.camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(this._spherical));
    this.camera.lookAt(target);
  }

  // === Scene Updates ===
  private updateScene(state: State) {
    this.updateControls(this.mesh!);
    this.setLights(state);
    this.zoomToFit();
    this.initCameraOrbit();
  }

  public setScene(state: State) {
    this.setMesh(state);
  }

  public setCamera(state: State) {
    this.camera.fov = state.camera.fov;
    this.camera.updateProjectionMatrix();
    this.composer?.render();
  }

  public resetView(playing = false) {
    this.setPlaying(playing);
    this.updateControls(this.mesh!);
    this.zoomToFit();
    this.initCameraOrbit();
  }
}