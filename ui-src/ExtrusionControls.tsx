import { State, Action, Extrusion } from "./reducer";
import FieldSet from "./FieldSet";
import Control from "./Control";

const ExtrusionControls = ({
  state,
  dispatch
}: {
  state: Extrusion;
  dispatch: (action: Action) => void;
}) => {
  return (
    <FieldSet 
      label="Extrusion">
      <Control
        label="Depth"
        type="range"
        min={0}
        max={200}
        step={1}
        value={state.depth}
        right={<span>{state.depth}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_EXTRUSION",
            extrusion: {
              depth: e.target.valueAsNumber
            }
          })
        }} />
      <Control
        label="Curve Segments"
        type="range"
        min={1}
        max={50}
        step={1}
        value={state.curveSegments}
        right={<span>{state.curveSegments}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_EXTRUSION",
            extrusion: {
              curveSegments: e.target.valueAsNumber
            }
          })
        }} />
      {/* <Control
        label="Bevel"
        type="checkbox"
        checked={state.bevelEnabled}
        onChange={() => {
          dispatch({
            type: "SET_EXTRUSION",
            extrusion: {
              bevelEnabled: !state.bevelEnabled
            }
          })
        }} /> */}
      <Control
        label="Bevel Thickness"
        type="range"
        min={0}
        max={5}
        step={0.1}
        value={state.bevelThickness}
        right={<span>{state.bevelThickness.toFixed(2)}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_EXTRUSION",
            extrusion: {
              bevelThickness: e.target.valueAsNumber
            }
          })
        }} />
      <Control
        label="Bevel Size"
        type="range"
        min={0}
        max={5}
        step={0.1}
        value={state.bevelSize}
        right={<span>{state.bevelSize.toFixed(2)}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_EXTRUSION",
            extrusion: {
              bevelSize: e.target.valueAsNumber
            }
          })
        }} />
      <Control
        label="Bevel Segments"
        type="range"
        min={1}
        max={10}
        step={1}
        value={state.bevelSegments}
        right={<span>{state.bevelSegments}</span>}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_EXTRUSION",
            extrusion: {
              bevelSegments: e.target.valueAsNumber
            }
          })
        }} />
    </FieldSet>
  );
};

export default ExtrusionControls;