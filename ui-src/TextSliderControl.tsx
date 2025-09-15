import { useState, useEffect } from "react";
import Control, { ControlProps } from "./Control";

const TextSliderControl = ({ ...props }: ControlProps) => {
  const [inputValue, setInputValue] = useState(props.value);

  // keep text input in sync with external changes
  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  const commitValue = (value: string, e: React.SyntheticEvent<HTMLInputElement>) => {
    const num = Number(value);

    if (!isNaN(num)) {
      const clamped = Math.min(
        Math.max(num, props.min ?? -Infinity),
        props.max ?? Infinity
      );

      // snap the text input to the clamped value
      setInputValue(clamped);

      // create a fake event so parent handler sees the correct shape
      const fakeEvent = {
        ...e,
        target: { ...e.target, value: String(clamped), valueAsNumber: clamped }
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      props.onChange?.(fakeEvent);
    } else {
      // reset to last valid prop value if invalid
      setInputValue(props.value);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // only update local state while typing
    setInputValue(e.target.value);
  };

  const handleTextBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    commitValue(e.target.value, e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitValue(e.currentTarget.value, e);
      (e.target as HTMLInputElement).blur(); // optional: blur after pressing Enter
    }
  };

  return (
    <Control
      {...props}
      type="range"
      right={
        <Control
          type="text"
          value={inputValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={handleKeyDown}
          modifier={["addon", "light"]}
        />
      }
      rightReadOnly={false}
    />
  );
};

export default TextSliderControl;