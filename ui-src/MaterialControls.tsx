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
      {
        state.type === "standard"
        ? <Control
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
        : null
      }
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
      {
        state.type === "physical"
        ? <>
            <Control
              label="Transmission"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.transmission}
              right={<span>{state.transmission.toFixed(2)}</span>}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch({
                  type: "SET_MATERIAL",
                  material: {
                    transmission: e.target.valueAsNumber
                  }
                })
              }} />
            <Control
              label="Thickness"
              type="range"
              min={0.01}
              max={1}
              step={0.01}
              value={state.thickness}
              right={<span>{state.thickness.toFixed(2)}</span>}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch({
                  type: "SET_MATERIAL",
                  material: {
                    thickness: e.target.valueAsNumber
                  }
                })
              }} />
            <Control
              label="Index of Refraction"
              type="range"
              min={1}
              max={2.33}
              step={0.01}
              value={state.ior}
              right={<span>{state.ior.toFixed(2)}</span>}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch({
                  type: "SET_MATERIAL",
                  material: {
                    ior: e.target.valueAsNumber
                  }
                })
              }} />
            <TextColorControl
              label="Attenuation Color"
              value={state.attenuationColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch({
                  type: "SET_MATERIAL",
                  material: {
                    attenuationColor: e.target.value
                  }
                })
              }} />
            <Control
              label="Attenuation Distance"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.attenuationDistance}
              right={<span>{state.attenuationDistance.toFixed(2)}</span>}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch({
                  type: "SET_MATERIAL",
                  material: {
                    attenuationDistance: e.target.valueAsNumber
                  }
                })
              }} />
          </>
        : null
      }
    </FieldSet>
  );
};

export default MaterialControls;