import {safeSingleToMultiple} from './safeSingleToMultiple';

export const getDefaultValue = (value, component, getInitialValue, onChangeCustom) => {
  // Allow components to set different default values.
  if (value == null) {
    if (component.hasOwnProperty('customDefaultValue')) {
      try {
        value = eval('(function(data, row) { var value = "";' + component.customDefaultValue.toString() + '; return value; })(data, row)');
      }
      catch (e) {
        /* eslint-disable no-console */
        console.warn('An error occurrend in a custom default value in ' + component.key, e);
        /* eslint-enable no-console */
        value = '';
      }
    }
    else if (component.hasOwnProperty('defaultValue')) {
      value = component.defaultValue;
      if (typeof onChangeCustom === 'function') {
        value = onChangeCustom(value);
      }
    }
    else if (typeof getInitialValue === 'function') {
      value = getInitialValue();
    }
    else {
      value = '';
    }
  }
  value = safeSingleToMultiple(value, component);
  return value;
};
