import { State, Action } from "./reducer";
import { Recorder } from "./useRecorder";
import Button from "./Button";
import './Canvas.css';
import { ThreeViewer } from "./viewer";

const Canvas = ({
  state, 
  dispatch,
  canvasRef,
  recorderRef,
  getSelectionSvg,
  threeViewerRef
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  recorderRef: Recorder;
  state: State;
  dispatch: (action: Action) => void;
  getSelectionSvg: () => void;
  threeViewerRef: React.RefObject<ThreeViewer>;
}) => {
  return (
    <div className={`c-canvas c-canvas--${state.background} figma-${state.background}`}>
      <div className="c-canvas__controls c-canvas__controls--top c-canvas__controls--right">
        <Button
          modifier={["circle", "icon"]}
          onClick={() => {
            dispatch({
              type: "SET_BACKGROUND",
              background: state.background === "light" ? "dark" : "light"
            })
          }}>
          {
            state.background === "light"
            ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 28q-62 0-105-43t-43-105q0-62 43-105t105-43q62 0 105 43t43 105q0 62-43 105t-105 43ZM200-466H66v-28h134v28Zm694 0H760v-28h134v28ZM466-760v-134h28v134h-28Zm0 694v-134h28v134h-28ZM274-668l-82-80 19-21 81 81-18 20Zm475 477-81-81 18-20 82 80-19 21Zm-81-495 80-82 21 19-81 81-20-18ZM191-211l81-81 18 18-79 83-20-20Zm289-269Z"/></svg>
            : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M483-172q-128.33 0-218.17-89.83Q175-351.67 175-480q0-113 71.5-197.5T425-783q-14 28-22 59t-8 64q0 111.67 78.17 189.83Q551.33-392 663-392q33 0 64-8t58-22q-20 107-104.5 178.5T483-172Zm0-28q88 0 158-48.5T743-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T367-660q0-20 3-40t8-40q-78 32-126.5 102T203-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
          }
        </Button>
      </div>
      {
        state.svg
        ? <>
            <div className="c-canvas__controls c-canvas__controls--bottom c-canvas__controls--right">
              <Button 
                modifier={["circle", "icon"]}
                onClick={() => {
                  threeViewerRef.current?.resetView();
                  dispatch({
                    type: "SET_PLAYING",
                    playing: false
                  })
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-132q-72.21 0-135.72-27.4-63.51-27.41-110.49-74.39-46.98-46.98-74.39-110.49Q132-407.79 132-480h28q0 128 87 220t215 100l-64-64 20-20 108 108q-11 2-23 3t-23 1Zm36-244v-208h108q17 0 28.5 11.5T664-544v128q0 17-11.5 28.5T624-376H516Zm-220 0v-28h120v-62h-80v-28h80v-62H296v-28h124q10.2 0 17.1 6.9 6.9 6.9 6.9 17.1v160q0 10.2-6.9 17.1-6.9 6.9-17.1 6.9H296Zm248-28h80q6 0 9-3t3-9v-128q0-6-3-9t-9-3h-80v152Zm256-76q0-128-87-220T498-800l64 64-20 20-108-108q11-2 23-3t23-1q72.21 0 135.72 27.41 63.51 27.4 110.49 74.38t74.38 110.49Q828-552.21 828-480h-28Z"/></svg>
              </Button>
            </div>
            <div className="c-canvas__controls c-canvas__controls--bottom c-canvas__controls--left">
              <Button 
                modifier={["circle", "icon"]}
                onClick={getSelectionSvg}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M680-158v-94h-94v-28h94v-94h28v94h94v28h-94v94h-28Zm-428-94v-122h28v94h94v28H252Zm0-334v-122h122v28h-94v94h-28Zm428 0v-94h-94v-28h122v122h-28Z"/></svg> 
              </Button>
            </div>
          </>
        : null
      }
      {
        recorderRef.videoUrl
        ? <div className="c-canvas__overlay">
            <video 
            className="c-app__video-preview"
            style={{
              width: "100%",
              height: "100%"
            }}
            src={recorderRef.videoUrl} 
            controls 
            autoPlay 
            loop />
          </div>
        : null
      }
      {
        recorderRef.recording
        ? <div className="c-canvas__overlay c-canvas__overlay--recording">
            <div className="c-canvas__rec-indicator">
              <span>{recorderRef.time}s</span>
            </div>
          </div>
        : null
      }
      {
        !state.svg && !state.loading
        ? <div className="c-canvas__overlay c-canvas__overlay--empty-state">
            <svg className="c-canvas__no-svg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m788-286-28-28v-414q0-12-10-22t-22-10H314l-28-28h442q26 0 43 17t17 43v442Zm40 194-80-80H232q-26 0-43-17t-17-43v-516l-80-80 20-20 736 736-20 20ZM318-306l66-86 64 74 69-85-317-317v488q0 12 10 22t22 10h488L614-306H318Zm219-231Zm-77 77Z"/></svg>
            <Button onClick={getSelectionSvg}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M680-158v-94h-94v-28h94v-94h28v94h94v28h-94v94h-28Zm-428-94v-122h28v94h94v28H252Zm0-334v-122h122v28h-94v94h-28Zm428 0v-94h-94v-28h122v122h-28Z"/></svg> 
              Add selection
            </Button>
          </div>
        : null
      }
      {
        state.loading
        ? <div className="c-canvas__overlay c-canvas__overlay--loading">
            <div className="loader">
              <div className="loader__top" />
              <div className="loader__middle" />
              <div className="loader__bottom" />
            </div>
          </div>
        : null
      }
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;