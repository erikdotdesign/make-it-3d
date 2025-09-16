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
        type: "standard",
        color: "#FFD700",
        transparent: true,
        opacity: 1,
        metalness: 0.96,
        roughness: 0.23,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: Infinity,
        side: "double"
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
        type: "standard",
        color: "#C0C0C0",
        transparent: true,
        opacity: 1,
        metalness: 0.96,
        roughness: 0.23,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: Infinity,
        side: "double"
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
        type: "standard",
        color: "#CD7F32",
        transparent: true,
        opacity: 1,
        metalness: 0.96,
        roughness: 0.23,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: Infinity,
        side: "double"
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
    name: "Plastic",
    value: "plastic",
    state: {
      material: { 
        type: "standard",
        color: "#ff0000", 
        transparent: true,
        opacity: 1, 
        metalness: 0, 
        roughness: 0.2,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: Infinity,
        side: "double"
      },
      lighting: { 
        key: { color: "#fff", intensity: 4 }, 
        fill: { color: "#fff", intensity: 2 }, 
        rim: { color: "#fff", intensity: 0.3 } 
      }
    }
  },
  // Rubber
  {
    name: "Rubber",
    value: "rubber",
    state: {
      material: { 
        type: "standard",
        color: "#228B22", 
        transparent: true,
        opacity: 1, 
        metalness: 0, 
        roughness: 0.7,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: Infinity,
        side: "double"
      },
      lighting: { 
        key: { color: "#fff", intensity: 3 }, 
        fill: { color: "#fff", intensity: 1.5 }, 
        rim: { color: "#fff", intensity: 0.2 } 
      }
    }
  },
  // Glass
  {
    name: "Glass",
    value: "glass",
    state: {
      material: { 
        type: "physical",
        color: "#ffffff",
        metalness: 0,
        roughness: 0.05,
        transparent: true,
        opacity: 1,
        transmission: 1,
        thickness: 1,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: 0.01,
        side: "double"
      },
      lighting: { 
        key: { color: "#fff", intensity: 5 }, 
        fill: { color: "#fff", intensity: 2 }, 
        rim: { color: "#fff", intensity: 0.5 } 
      }
    }
  },
  // Liquid
  {
    name: "Liquid",
    value: "liquid",
    state: {
      material: {
        type: "physical",
        color: "#FFA500",
        metalness: 0,
        roughness: 0.05,
        transparent: true,
        opacity: 1,
        transmission: 0.85,
        thickness: 0.4,
        ior: 1.35,
        attenuationColor: "#FFA500",
        attenuationDistance: 1.5,
        side: "double"
      },
      lighting: {
        key: { color: "#fff", intensity: 5 },
        fill: { color: "#fff", intensity: 2 },
        rim: { color: "#fff", intensity: 0.5 }
      }
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