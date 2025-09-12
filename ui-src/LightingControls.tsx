import { Action, Lighting } from "./reducer";
import FieldSet from "./FieldSet";
import Control from "./Control";
import TextColorControl from "./TextColorControl";
import { capitalize } from "./helpers";

const LightingControls = ({
  state,
  dispatch
}: {
  state: Lighting;
  dispatch: (action: Action) => void;
}) => {
  return (
    Object.keys(state).map((k, i) => (
      <FieldSet 
        key={k}
        label={`${capitalize(k)} Light`}>
        <TextColorControl
          labelAlt="Color"
          value={state[k as keyof Lighting].color}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: "SET_LIGHT",
              key: k as keyof Lighting,
              light: {
                color: e.target.value
              }
            })
          }} />
        <Control
          label="Intensity"
          type="range"
          min={0}
          max={100}
          step={0.01}
          value={state[k as keyof Lighting].intensity}
          right={<span>{state[k as keyof Lighting].intensity}</span>}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: "SET_LIGHT",
              key: k as keyof Lighting,
              light: {
                intensity: e.target.valueAsNumber
              }
            })
          }} />
      </FieldSet>
    ))
  )
};

export default LightingControls;