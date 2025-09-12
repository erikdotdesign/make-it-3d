import { getModifierClasses } from "./helpers";

import "./Control.css";

const FieldSet = ({
  label,
  children,
  modifier,
  ...props
}: {
  label: string;
  children: any;
  modifier?: string | string[];
}) => {
  const modifierClasses = getModifierClasses("c-control-fieldset", modifier);
  return (
    <fieldset 
      className={`c-control-fieldset ${modifierClasses}`}
      {...props}>
      <legend className="c-control__label c-control__label--legend">
        { label }
      </legend>
      { children }
    </fieldset>
  );
};

export default FieldSet;