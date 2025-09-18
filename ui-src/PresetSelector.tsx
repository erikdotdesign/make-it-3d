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
    name: "Gold",
    value: "gold",
    state: {
      material: {
        type: "standard",
        transparent: true,
        color: "#FFD700",
        emissive: "#000000",
        emissiveIntensity: 1,
        opacity: 1,
        metalness: 1,
        roughness: 0.23,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: 1,
        side: "double"
      },
      lighting: {
        key: { color: "#ffffff", intensity: 5 },
        fill: { color: "#ffffff", intensity: 2.5 },
        rim: { color: "#ffffff", intensity: 0.5 }
      }
    }
  },{
    name: "Silver",
    value: "silver",
    state: {
      material: {
        type: "standard",
        transparent: true,
        color: "#C0C0C0",
        emissive: "#000000",
        emissiveIntensity: 1,
        opacity: 1,
        metalness: 1,
        roughness: 0.23,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: 1,
        side: "double"
      },
      lighting: {
        key: { color: "#ffffff", intensity: 5 },
        fill: { color: "#ffffff", intensity: 2.5 },
        rim: { color: "#ffffff", intensity: 0.5 }
      }
    }
  },{
    name: "Bronze",
    value: "bronze",
    state: {
      material: {
        type: "standard",
        transparent: true,
        color: "#CD7F32",
        emissive: "#000000",
        emissiveIntensity: 1,
        opacity: 1,
        metalness: 1,
        roughness: 0.23,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: 1,
        side: "double"
      },
      lighting: {
        key: { color: "#ffffff", intensity: 5 },
        fill: { color: "#ffffff", intensity: 2.5 },
        rim: { color: "#ffffff", intensity: 0.5 }
      }
    }
  },{
    name: "Plastic",
    value: "plastic",
    state: {
      material: { 
        type: "standard",
        color: "#ff0000", 
        emissive: "#000000",
        emissiveIntensity: 1,
        transparent: true,
        opacity: 1, 
        metalness: 0, 
        roughness: 0.2,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: 1,
        side: "double"
      },
      lighting: { 
        key: { color: "#ffffff", intensity: 4 }, 
        fill: { color: "#ffffff", intensity: 2 }, 
        rim: { color: "#ffffff", intensity: 0.3 } 
      }
    }
  },{
    name: "Rubber",
    value: "rubber",
    state: {
      material: { 
        type: "standard",
        color: "#228B22", 
        emissive: "#000000",
        emissiveIntensity: 1,
        transparent: true,
        opacity: 1, 
        metalness: 0, 
        roughness: 0.7,
        transmission: 0,
        thickness: 0,
        ior: 1.5,
        attenuationColor: "#ffffff",
        attenuationDistance: 1,
        side: "double"
      },
      lighting: { 
        key: { color: "#ffffff", intensity: 3 }, 
        fill: { color: "#ffffff", intensity: 1.5 }, 
        rim: { color: "#ffffff", intensity: 0.2 } 
      }
    }
  },{
    name: "Wood",
    value: "wood",
    state: {
      material: {
        type: "standard",
        color: "#8B5A2B",
        emissive: "#000000",
        emissiveIntensity: 1,
        metalness: 0,
        roughness: 0.6,
        transparent: false,
        opacity: 1,
        transmission: 0,
        thickness: 0.5,
        ior: 1.45,
        attenuationColor: "#8B5A2B",
        attenuationDistance: 0.1,
        side: "double"
      },
      lighting: { 
        key: { color: "#fff", intensity: 3 }, 
        fill: { color: "#fff", intensity: 1.5 }, 
        rim: { color: "#fff", intensity: 0.2 } 
      }
    }
  },{
    name: "Marble",
    value: "marble",
    state: {
      material: {
        type: "standard",
        color: "#dcdcdc",
        emissive: "#000000",
        emissiveIntensity: 1,
        metalness: 0,
        roughness: 0.45,
        transparent: false,
        opacity: 1,
        transmission: 0,
        thickness: 0.5,
        ior: 1.5,
        attenuationColor: "#dcdcdc",
        attenuationDistance: 0.1,
        side: "double"
      },
      lighting: { 
        key: { color: "#fff", intensity: 4 }, 
        fill: { color: "#fff", intensity: 2 }, 
        rim: { color: "#fff", intensity: 0.5 } 
      }
    }
  },{
    name: "Ruby",
    value: "ruby",
    state: {
      material: {
        type: "physical",
        color: "#ff0000",
        emissive: "#000000",
        emissiveIntensity: 1,
        metalness: 0,
        roughness: 0.02,
        transparent: true,
        opacity: 1,
        transmission: 1,
        thickness: 1.0,
        ior: 2.33,
        attenuationColor: "#ff4d4d",
        attenuationDistance: 0.2,
        side: "double"
      },
      lighting: {
        key: { color: "#fff", intensity: 5 },
        fill: { color: "#fff", intensity: 2.5 },
        rim: { color: "#fff", intensity: 1 }
      }
    }
  },{
    name: "Emerald",
    value: "emerald",
    state: {
      material: {
        type: "physical",
        color: "#00cc00",
        emissive: "#000000",
        emissiveIntensity: 1,
        metalness: 0,
        roughness: 0.02,
        transparent: true,
        opacity: 1,
        transmission: 1,
        thickness: 1.0,
        ior: 2.33,
        attenuationColor: "#66ff66",
        attenuationDistance: 0.2,
        side: "double"
      },
      lighting: {
        key: { color: "#fff", intensity: 5 },
        fill: { color: "#fff", intensity: 2.5 },
        rim: { color: "#fff", intensity: 1 }
      }
    }
  },{
    name: "Sapphire",
    value: "sapphire",
    state: {
      material: {
        type: "physical",
        color: "#0000ff",
        emissive: "#000000",
        emissiveIntensity: 1,
        metalness: 0,
        roughness: 0.02,
        transparent: true,
        opacity: 1,
        transmission: 1,
        thickness: 1.0,
        ior: 2.33,
        attenuationColor: "#4d4dff",
        attenuationDistance: 0.2,
        side: "double"
      },
      lighting: {
        key: { color: "#fff", intensity: 5 },
        fill: { color: "#fff", intensity: 2.5 },
        rim: { color: "#fff", intensity: 1 }
      }
    }
  },{
    name: "Amethyst",
    value: "amethyst",
    state: {
      material: {
        type: "physical",
        color: "#f000f0",
        emissive: "#000000",
        emissiveIntensity: 1,
        metalness: 0,
        roughness: 0.02,
        transparent: true,
        opacity: 1,
        transmission: 1,
        thickness: 1.0,
        ior: 2.33,
        attenuationColor: "#b266b2",
        attenuationDistance: 0.2,
        side: "double"
      },
      lighting: {
        key: { color: "#fff", intensity: 5 },
        fill: { color: "#fff", intensity: 2.5 },
        rim: { color: "#fff", intensity: 1 }
      }
    }
  },{
    name: "Glass",
    value: "glass",
    state: {
      material: { 
        type: "physical",
        color: "#ffffff",
        emissive: "#000000",
        emissiveIntensity: 1,
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
        key: { color: "#ffffff", intensity: 5 }, 
        fill: { color: "#ffffff", intensity: 2 }, 
        rim: { color: "#ffffff", intensity: 0.5 } 
      }
    }
  },{
    name: "Ice",
    value: "ice",
    state: {
      material: {
        type: "physical",
        color: "#cceaff",
        emissive: "#000000",
        emissiveIntensity: 1,
        metalness: 0,
        roughness: 0.5,
        transparent: true,
        opacity: 1,
        transmission: 0.9,
        thickness: 0.7,
        ior: 1.31,
        attenuationColor: "#a0d8ff",
        attenuationDistance: 0.3,
        side: "double"
      },
      lighting: { 
        key: { color: "#fff", intensity: 5 }, 
        fill: { color: "#fff", intensity: 2 }, 
        rim: { color: "#fff", intensity: 0.5 } 
      }
    }
  },{
    name: "Liquid",
    value: "liquid",
    state: {
      material: {
        type: "physical",
        color: "#FFA500",
        emissive: "#000000",
        emissiveIntensity: 1,
        metalness: 0,
        roughness: 0.05,
        transparent: true,
        opacity: 1,
        transmission: 0.85,
        thickness: 0.4,
        ior: 1.35,
        attenuationColor: "#FFA500",
        attenuationDistance: 0.3,
        side: "double"
      },
      lighting: {
        key: { color: "#ffffff", intensity: 5 },
        fill: { color: "#ffffff", intensity: 2 },
        rim: { color: "#ffffff", intensity: 0.5 }
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