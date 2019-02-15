
export const safeSingleToMultiple = (value, component) => {
  // Don't do anything to datagrid or containers.
  if ((component.type === 'datagrid') || (component.type === 'container') || (component.type === 'editgrid')) {
    return value;
  }
  // If this was a single but is not a multivalue.
  if (component.multiple && !Array.isArray(value)) {
    if (component.type === 'select' && !value) {
      value = [];
    }
    else {
      value = [value];
    }
  }
  // If this was a multivalue but is now single value.
  // RE-60 :-Need to return the value as array of object instead of object while converting  a multivalue to single value for datagrid component
  else if (!component.multiple && Array.isArray(value)) {
    value = value[0];
  }
  // Set dates to Date object.
  if (component.type === 'datetime' && value && !(value instanceof Date)) {
    value = new Date(value);
  }
  return value;
};
