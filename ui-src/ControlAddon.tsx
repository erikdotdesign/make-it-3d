import React from 'react';
import './Control.css';

const ControlAddon = ({
  type,
  readOnly,
  children
}: {
  type: "left" | "right";
  readOnly?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <span className={`c-control__addon c-control__addon--${type} ${readOnly === true ? `c-control__addon--read-only` : ""}`}>
      { children }
    </span>
  )
};

export default ControlAddon;