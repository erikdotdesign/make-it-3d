import { getModifierClasses } from './helpers';
import './Sidebar.css';

const Sidebar = ({
  children,
  modifier
}: {
  children?: React.ReactNode;
  modifier?: string | string[];
}) => {
  const modifierClasses = getModifierClasses("c-sidebar", modifier);
  return (
    <div className={`c-sidebar ${modifierClasses}`}>
      { children }
    </div>
  );
};

export default Sidebar;