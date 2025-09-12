import Control, { ControlProps } from './Control';

const Select = ({
  children,
  ...props
}: ControlProps) => {
  return (
    <Control
      {...props}
      as="select"
      right={<span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-380 276-584l20-20 184 184 184-184 20 20-204 204Z"/></svg></span>}
      rightReadOnly={true}>
      { children }
    </Control>
  )
}

export default Select;