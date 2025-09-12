import { Recorder } from "./useRecorder";
import './Canvas.css';

const Canvas = ({
  canvasRef,
  recorderRef
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  recorderRef: Recorder;
}) => {
  return (
    <div className="c-canvas">
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
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;