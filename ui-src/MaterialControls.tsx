import { Action, Material } from "./reducer";
import FieldSet from "./FieldSet";
import Control from "./Control";
import TextColorControl from "./TextColorControl";

const MaterialControls = ({
  state,
  dispatch
}: {
  state: Material;
  dispatch: (action: Action) => void;
}) => {
  return (
    <FieldSet 
      label="Material">
      <TextColorControl
        label="Color"
        value={state.color}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_MATERIAL",
            material: {
              color: e.target.value
            }
          })
        }} />
      <Control
        label="Opacity"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={state.opacity}
        right={<span>{state.opacity.toFixed(2)}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_MATERIAL",
            material: {
              opacity: e.target.valueAsNumber
            }
          })
        }} />
      <Control
        label="Metalness"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={state.metalness}
        right={<span>{state.metalness.toFixed(2)}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_MATERIAL",
            material: {
              metalness: e.target.valueAsNumber
            }
          })
        }} />
      <Control
        label="Roughness"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={state.roughness}
        right={<span>{state.roughness.toFixed(2)}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_MATERIAL",
            material: {
              roughness: e.target.valueAsNumber
            }
          })
        }} />
    </FieldSet>
  );
};

export default MaterialControls;