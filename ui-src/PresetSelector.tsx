import { useState, useEffect } from "react";
import { ControlProps } from './Control';
import Select from "./Select";
import { State, Action } from "./reducer";

type Preset = {
  name: string;
  value: string;
  state: Partial<State>
}

const PresetSelector = ({
  state,
  dispatch,
  ...props
}: {
  state: State,
  dispatch: (action: Action) => void;
} & ControlProps) => {
  const [preset, setPreset] = useState("metalic");

  const presets: Preset[] = [{
    name: "Metalic Gold",
    value: "metalic-gold",
    state: {
      material: {
        color: "#FFD700",
        opacity: 1,
        metalness: 0.96,
        roughness: 0.23
      },
      lighting: {
        key: { color: "#fff", intensity: 5 },
        fill: { color: "#fff", intensity: 2.5 },
        rim: { color: "#fff", intensity: 0.5 }
      }
    }
  },{
    name: "Metalic Silver",
    value: "metalic-silver",
    state: {
      material: {
        color: "#C0C0C0",
        opacity: 1,
        metalness: 0.96,
        roughness: 0.23
      },
      lighting: {
        key: { color: "#fff", intensity: 5 },
        fill: { color: "#fff", intensity: 2.5 },
        rim: { color: "#fff", intensity: 0.5 }
      }
    }
  },{
    name: "Metalic Bronze",
    value: "metalic-bronze",
    state: {
      material: {
        color: "#CD7F32",
        opacity: 1,
        metalness: 0.96,
        roughness: 0.23
      },
      lighting: {
        key: { color: "#fff", intensity: 5 },
        fill: { color: "#fff", intensity: 2.5 },
        rim: { color: "#fff", intensity: 0.5 }
      }
    }
  },
  // Plastic
  {
    name: "Glossy Red Plastic",
    value: "plastic-red",
    state: {
      material: { color: "#ff0000", opacity: 1, metalness: 0, roughness: 0.2 },
      lighting: { key: { color: "#fff", intensity: 4 }, fill: { color: "#fff", intensity: 2 }, rim: { color: "#fff", intensity: 0.3 } }
    }
  },
  {
    name: "Matte Blue Plastic",
    value: "plastic-blue",
    state: {
      material: { color: "#1E90FF", opacity: 1, metalness: 0, roughness: 0.6 },
      lighting: { key: { color: "#fff", intensity: 4 }, fill: { color: "#fff", intensity: 2 }, rim: { color: "#fff", intensity: 0.3 } }
    }
  },
  // Rubber
  {
    name: "Black Rubber",
    value: "rubber-black",
    state: {
      material: { color: "#111111", opacity: 1, metalness: 0, roughness: 0.8 },
      lighting: { key: { color: "#fff", intensity: 3 }, fill: { color: "#fff", intensity: 1.5 }, rim: { color: "#fff", intensity: 0.2 } }
    }
  },
  {
    name: "Colored Rubber (Green)",
    value: "rubber-green",
    state: {
      material: { color: "#228B22", opacity: 1, metalness: 0, roughness: 0.7 },
      lighting: { key: { color: "#fff", intensity: 3 }, fill: { color: "#fff", intensity: 1.5 }, rim: { color: "#fff", intensity: 0.2 } }
    }
  },
  // Glass
  {
    name: "Clear Glass",
    value: "glass-clear",
    state: {
      material: { color: "#ffffff", metalness: 0, roughness: 0, opacity: 0.25 },
      lighting: { key: { color: "#fff", intensity: 5 }, fill: { color: "#fff", intensity: 2 }, rim: { color: "#fff", intensity: 0.5 } }
    }
  },
  {
    name: "Tinted Glass (Blue)",
    value: "glass-blue",
    state: {
      material: { color: "#87CEFA", metalness: 0, roughness: 0, opacity: 0.35 },
      lighting: { key: { color: "#fff", intensity: 5 }, fill: { color: "#fff", intensity: 2 }, rim: { color: "#fff", intensity: 0.5 } }
    }
  }];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPreset = presets.find((p) => p.value === e.target.value);
    if (selectedPreset) {
      dispatch({
        type: "HYDRATE_STATE", 
        state: selectedPreset.state as State
      });
      setPreset(selectedPreset.value);
    }
  }

  // Robust partial deep equality check
  const matchesPreset = (presetState: any, externalState: any): boolean => {
    if (!presetState || !externalState) return false;

    // Check every key in the preset
    return Object.keys(presetState).every(key => {
      const presetVal = presetState[key];
      const externalVal = externalState[key];

      // If the preset key is missing in external state, no match
      if (externalVal === undefined) return false;

      // Arrays: compare element by element
      if (Array.isArray(presetVal)) {
        if (!Array.isArray(externalVal)) return false;
        if (presetVal.length !== externalVal.length) return false;
        return presetVal.every((v, i) => {
          const extV = externalVal[i];
          if (v && typeof v === "object") {
            return matchesPreset(v, extV);
          }
          return v === extV;
        });
      }

      // Objects: recurse
      if (presetVal && typeof presetVal === "object") {
        return matchesPreset(presetVal, externalVal);
      }

      // Primitives: strict equality
      return presetVal === externalVal;
    });
  };

  useEffect(() => {
    // Find the first preset that matches the current state
    const matchedPreset = presets.find(p => matchesPreset(p.state, state));

    if (matchedPreset) {
      // If it matches a preset, select it
      setPreset(matchedPreset.value);
    } else {
      // Otherwise, mark as custom
      if (preset !== "custom") setPreset("custom");
    }
  }, [state]);

  return (
    <Select
      label="PRESET"
      onChange={handleChange}
      value={preset}
      {...props}>
      {
        preset === "custom"
        ? <option value="custom">Custom</option>
        : null
      }
      {presets.map((p) => (
        <option key={p.value} value={p.value}>{p.name}</option>
      ))}
    </Select>
  )
}

export default PresetSelector;