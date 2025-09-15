import { useState, useEffect } from "react";
import chroma from "chroma-js";
import Control, { ControlProps } from './Control';
import ColorControl from './ColorControl';

const TextColorControl = ({
  ...props
}: ControlProps) => {
  const [inputValue, setInputValue] = useState(props.value);
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      const value = e.target.value;
      setInputValue(value);
      const isValid = chroma.valid(value);
      if (isValid) {
        const hex = chroma(value).hex();
        e.target.value = hex;
        props.onChange(e);
      }
    }
  }

  const handleBlur = () => {
    if (!chroma.valid(inputValue)) {
      setInputValue(props.value);
    } else {
      setInputValue(chroma(inputValue).hex());
    }
    setFocused(false);
  }

  const handleFocus = () => {
    setFocused(true);
  }

  useEffect(() => {
    if (!focused) {
      setInputValue(props.value);
    }
  }, [props.value])

  return (
    <Control
      {...props}
      as="input"
      type="text"
      modifier={["light"]}
      right={
        <ColorControl
          value={props.value}
          onChange={props.onChange}
          icon />
      }
      rightReadOnly={false}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      value={inputValue} />
  )
}

export default TextColorControl;