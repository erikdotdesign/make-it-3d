import { Action, Camera } from "./reducer";
import FieldSet from "./FieldSet";
import Control from "./Control";

const CameraControls = ({
  state,
  dispatch
}: {
  state: Camera;
  dispatch: (action: Action) => void;
}) => {
  return (
    <FieldSet 
      label="Camera">
      <Control
        label="Field of View"
        type="range"
        min={40}
        max={100}
        step={1}
        value={state.fov}
        right={<span>{state.fov}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_CAMERA",
            camera: {
              fov: e.target.valueAsNumber
            }
          })
        }} />
      {/* <Control
        label="Zoom"
        type="range"
        min={0.01}
        max={100}
        step={0.01}
        value={state.zoom}
        right={<span>{state.zoom.toFixed(2)}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_CAMERA",
            camera: {
              zoom: e.target.valueAsNumber
            }
          })
        }} /> */}
    </FieldSet>
  );
};

export default CameraControls;