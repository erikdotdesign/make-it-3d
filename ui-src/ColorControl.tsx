import Control, { ControlProps } from './Control';

const ColorControl = ({
  children,
  ...props
}: ControlProps) => {
  const colorIcon = (
    <div 
      className='c-control__color-box'
      style={{
        background: props.value as string
      }} />
  );
  return (
    <Control
      {...props}
      icon={props.icon}
      as="input"
      type="color"
      replacement={
        <div className="c-control__input c-control__input--color">
          { props.icon 
            ? colorIcon
            : props.value 
          }
        </div>
      }
      right={
        props.icon
        ? props.right
        : colorIcon
      }
      rightReadOnly={false} />
  )
}

export default ColorControl;