import React from 'react';
import { getModifierClasses } from './helpers';
import ControlAddon from './ControlAddon';
import './Control.css';

export type ControlProps =  React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> & {
  as?: "input" | "select" | "textarea";
  containerAs?: "label" | "div";
  containerProps?: any; 
  children?: React.ReactNode;
  inputRef?: any;
  label?: string;
  labelAlt?: string;
  modifier?: string | string[];
  replacement?: React.ReactNode;
  left?: React.ReactNode;
  leftReadOnly?: boolean;
  right?: React.ReactNode;
  rightReadOnly?: boolean;
  icon?: boolean;
};

const Control = ({
  inputRef,
  label,
  labelAlt,
  as: Tag = 'input',
  containerAs: ContainerTag = "label",
  containerProps,
  children,
  modifier,
  replacement,
  left,
  leftReadOnly,
  right,
  rightReadOnly,
  icon,
  ...props
}: ControlProps) => {
  const modifierClasses = getModifierClasses("c-control", modifier);

  return (
    <ContainerTag className={`c-control ${modifierClasses} ${props.type ? `c-control--${props.type}` : ""} ${icon ? `c-control--icon` : ""}`} {...containerProps}>
      {
        label || labelAlt
        ? <div className="c-control__label">
            { label } <span>{ labelAlt }</span>
          </div>
        : null
      }
      <div className="c-control__input-wrap">
        {
          props.type === "range"
          ? <div className={`c-control__track ${right ? "c-control__track--right" : ""} ${left ? "c-control__track--left" : ""}`}>
              <div className='c-control__track-inner' />
            </div>
          : null
        }
        <Tag
          ref={inputRef}
          className={`c-control__input ${right ? "c-control__input--right" : ""} ${left ? "c-control__input--left" : ""}`}
          { ...props }>
          {children}
        </Tag>
        { replacement }
        {
          left
          ? <ControlAddon 
              type='left'
              readOnly={leftReadOnly}>
              { left }
            </ControlAddon>
          : null
        }
        {
          right
          ? <ControlAddon 
              type='right'
              readOnly={rightReadOnly}>
              { right }
            </ControlAddon>
          : null
        }
        {
          props.type === "checkbox" || props.type === "radio"
          ? <span className="c-control__checkmark" />
          : null
        }
      </div>
    </ContainerTag>
  )
};

export default Control;