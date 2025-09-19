import { useRef, useReducer } from "react";
import reducer from "./reducer";
import useFigmaSelection from "./useFigmaSelection";
import useThreeViewer from "./useThreeViewer";
import useRecorder from "./useRecorder";
import usePluginStorage from "./usePluginStorage";
import Canvas from "./Canvas";
import RightControls from "./RightControls";
import "./App.css";

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    playing: true,
    background: "dark",
    svg: "",
    camera: {
      fov: 75,
      zoom: 5
    },
    extrusion: {
      curveSegments: 24,
      steps: 1,
      depth: 10,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.5,
      bevelSegments: 4,
      bevelOffset: 0
    },
    material: {
      type: "standard",
      transparent: true,
      color: "#FFD700",
      emissive: "#000000",
      emissiveIntensity: 1,
      opacity: 1,
      metalness: 1,
      roughness: 0.23,
      transmission: 0,
      thickness: 0,
      ior: 1.5,
      attenuationColor: "#ffffff",
      attenuationDistance: 1,
      side: "double"
    },
    lighting: {
      key: { color: "#ffffff", intensity: 5 },
      fill: { color: "#ffffff", intensity: 2.5 },
      rim: { color: "#ffffff", intensity: 0.5 }
    },
    hydrated: false,
    loading: true
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const threeViewerRef = useThreeViewer(
    canvasRef, 
    state, 
    dispatch
  );
  
  const recorderRef = useRecorder(canvasRef);
  const { getSelectionSvg } = useFigmaSelection(state, dispatch);

  usePluginStorage(
    state, 
    dispatch
  );

  return (
    <main className="c-app">
      <section className="c-app__body">
        <Canvas
          state={state}
          dispatch={dispatch}
          canvasRef={canvasRef}
          recorderRef={recorderRef}
          getSelectionSvg={getSelectionSvg}
          threeViewerRef={threeViewerRef} />
        <RightControls
          state={state}
          dispatch={dispatch}
          recorderRef={recorderRef} />
      </section>
    </main>
  );
};

export default App;