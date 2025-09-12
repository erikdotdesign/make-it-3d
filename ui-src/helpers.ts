export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getModifierClasses = (baseClass: string, modifier?: string | string[]) => {
  const modifierClasses = Array.isArray(modifier)
    ? modifier.map((m) => `${baseClass}--${m}`).join(' ')
    : modifier
    ? `${baseClass}--${modifier}`
    : '';
  return modifierClasses;
};