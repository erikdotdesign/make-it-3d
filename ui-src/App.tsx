import { useRef, useReducer } from "react";
import reducer from "./reducer";
import useTextSelection from "./useTextSelection";
import use3dText from "./useTextViewer";
import useRecorder from "./useRecorder";
import usePluginStorage from "./usePluginStorage";
import Canvas from "./Canvas";
import RightControls from "./RightControls";
import "./App.css";

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    playing: true,
    zoom: 5,
    text: "",
    extrusion: {
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 3
    },
    material: {
      color: "#ffffff",
      metalness: 0,
      roughness: 1
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
  const { getTextSelection } = useTextSelection(dispatch);

  const textViewer = use3dText(
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