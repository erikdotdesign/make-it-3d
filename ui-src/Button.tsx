import React from 'react';
import { getModifierClasses } from './helpers';
import './Button.css';

const Button = ({
  children,
  modifier,
  bRef,
  ...props
}: {
  children?: React.ReactNode;
  modifier?: string | string[];
  bRef?: (el: HTMLButtonElement) => HTMLButtonElement | React.RefObject<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const modifierClasses = getModifierClasses("c-button", modifier);
  return (
    <button
      ref={bRef}
      className={`c-button ${modifierClasses}`}
      {...props}>
      {children}
    </button>
  )
};

export default Button;