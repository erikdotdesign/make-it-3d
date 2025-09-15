export type Camera = {
  fov: number;
  zoom: number;
};

export type Extrusion = {
  depth: number;
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelSegments: number;
  bevelOffset: number;
};

export type Material = {
  color: string;
  metalness: number;
  roughness: number;
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
  text: string;
  geometryScale: number;
  camera: Camera;
  extrusion: Extrusion;
  material: Material;
  lighting: Lighting;
  hydrated: boolean;
};

export type Action = 
  | { type: "HYDRATE_STATE"; state: State } 
  | { type: "SET_PLAYING", playing: boolean } 
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_TEXT"; text: string, geometryScale: number }
  | { type: "SET_CAMERA"; camera: Partial<Camera> }
  | { type: "SET_EXTRUSION"; extrusion: Partial<Extrusion> }
  | { type: "SET_MATERIAL"; material: Partial<Material> }
  | { type: "SET_LIGHT"; key: "key" | "fill" | "rim", light: Partial<Light> }
  

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "HYDRATE_STATE": return { ...state, ...action.state, hydrated: true };
    case "SET_PLAYING": return { ...state, playing: action.playing };
    case "SET_TEXT": return { 
      ...state, 
      text: action.text,
      geometryScale: action.geometryScale
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
    default: return state;
  }
};

export default reducer;