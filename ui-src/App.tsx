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