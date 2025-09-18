export type Background = "light" | "dark";

export type Camera = {
  fov: number;
  zoom: number;
};

export type Extrusion = {
  steps: number;
  curveSegments: number;
  depth: number;
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  bevelOffset: number;
};

export type Material = {
  type: "standard" | "physical";
  transparent: boolean;
  color: string;
  emissive: string;
  emissiveIntensity: number;
  opacity: number;
  metalness: number;
  roughness: number;
  transmission: number;
  thickness: number;
  ior: number;
  attenuationColor: string;
  attenuationDistance: number;
  side: "front" | "back" | "double";
};

export type Light = {
  color: string;
  intensity: number;
};

export type Lighting = {
  key: Light;
  fill: Light;
  rim: Light;
};

export type State = {
  playing: boolean;
  svg: string;
  background: Background;
  camera: Camera;
  extrusion: Extrusion;
  material: Material;
  lighting: Lighting;
  hydrated: boolean;
  loading: boolean;
};

export type Action = 
  | { type: "HYDRATE_STATE"; state: State } 
  | { type: "SET_PLAYING", playing: boolean } 
  | { type: "SET_BACKGROUND", background: Background } 
  | { type: "SET_SVG"; svg: string }
  | { type: "SET_CAMERA"; camera: Partial<Camera> }
  | { type: "SET_EXTRUSION"; extrusion: Partial<Extrusion> }
  | { type: "SET_MATERIAL"; material: Partial<Material> }
  | { type: "SET_LIGHT"; key: "key" | "fill" | "rim", light: Partial<Light> }
  | { type: "SET_LOADING", loading: boolean } 
  

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "HYDRATE_STATE": return { ...state, ...action.state, hydrated: true };
    case "SET_PLAYING": return { ...state, playing: action.playing };
    case "SET_BACKGROUND": return { 
      ...state, 
      background: action.background
    };
    case "SET_SVG": return { 
      ...state, 
      svg: action.svg
    };
    case "SET_CAMERA": return { 
      ...state, 
      camera: { ...state.camera, ...action.camera }
    };
    case "SET_EXTRUSION": return { 
      ...state, 
      extrusion: { ...state.extrusion, ...action.extrusion }
    };
    case "SET_MATERIAL": return { 
      ...state, 
      material: { ...state.material, ...action.material }
    };
    case "SET_LIGHT": return { 
      ...state, 
      lighting: {
        ...state.lighting,
        [action.key]: {
          ...state.lighting[action.key],
          ...action.light
        }
      }
    };
    case "SET_LOADING": return { ...state, loading: action.loading };
    default: return state;
  }
};

export default reducer;