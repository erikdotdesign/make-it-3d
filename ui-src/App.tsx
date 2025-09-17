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
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 3,
      bevelOffset: 0
    },
    material: {
      type: "standard",
      color: "#ffffff",
      transparent: false,
      opacity: 1,
      metalness: 0,
      roughness: 1,
      transmission: 0,
      thickness: 0,
      ior: 1.5,
      attenuationColor: "#ffffff",
      attenuationDistance: Infinity,
      side: "double"
    },
    lighting: {
      key: {
        color: "#ffffff",
        intensity: 1,
      },
      fill: {
        color: "#ffffff",
        intensity: 0.3
      },
      rim: {
        color: "#ffffff",
        intensity: 0.2
      }
    },
    hydrated: false
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRecorder(canvasRef);
  const { getSelectionSvg } = useFigmaSelection(dispatch);

  const threeViewer = useThreeViewer(
    canvasRef, 
    state, 
    dispatch
  );

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
          recorderRef={recorderRef} />
        <RightControls
          state={state}
          dispatch={dispatch}
          recorderRef={recorderRef} />
      </section>
    </main>
  );
};

export default App;