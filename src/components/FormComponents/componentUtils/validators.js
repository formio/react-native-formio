
export const validateItem = (item, component, data) => {
  let state = {
    isValid: true,
    errorType: '',
    errorMessage: '',
    item,
  };
  // Check for no validation criteria
  if (!component.validate) {
    return state;
  }
  // Required
  if (component.validate.required) {
    // Multivalue and selectboxes are exceptions since !![] === true and !!{} === true.
    if (component.type === 'selectboxes' && !Object.keys(item).reduce((prev, cur) => {
      return prev || item[cur];
    }, false)) {
      state.isValid = false;
      state.errorType = 'required';
      state.errorMessage = (component.label || component.key) + ' is required.';
    }
    else if (!item) {
      state.isValid = false;
      state.errorType = 'required';
      state.errorMessage = (component.label || component.key) + ' is required.';
    }
  }
  // Email
  if (state.isValid && component.type === 'email' && !item.match(/\S+@\S+/)) {
    state.isValid = false;
    state.errorType = 'email';
    state.errorMessage = (component.label || component.key) + ' must be a valid email.';
  }
  // MaxLength
  if (state.isValid && component.validate.maxLength && item.length > component.validate.maxLength) {
    state.isValid = false;
    state.errorType = 'maxlength';
    state.errorMessage = (component.label || component.key) + ' cannot be longer than ' + (component.validate.maxLength) + ' characters.';
  }
  // MinLength
  if (state.isValid && component.validate.minLength && item.length < component.validate.minLength) {
    state.isValid = false;
    state.errorType = 'minlength';
    state.errorMessage = (component.label || component.key) + ' cannot be shorter than ' + (component.validate.minLength) + ' characters.';
  }
  // MaxValue
  if (state.isValid && component.validate.max && item > component.validate.max) {
    state.isValid = false;
    state.errorType = 'max';
    state.errorMessage = (component.label || component.key) + ' cannot be greater than ' + component.validate.max;
  }
  // MinValue
  if (state.isValid && component.validate.min && item < component.validate.min) {
    state.isValid = false;
    state.errorType = 'min';
    state.errorMessage = (component.label || component.key) + ' cannot be less than ' + component.validate.min;
  }
  // Regex
  if (state.isValid && component.validate.pattern) {
    const re = new RegExp(component.validate.pattern, 'g');
    state.isValid = item.match(re);
    if (!state.isValid) {
      state.errorType = 'regex';
      state.errorMessage = (component.label || component.key) + ' must match the expression: ' + component.validate.pattern;
    }
  }
  // Input Mask
  if (component.inputMask && item.includes('_')) {
    state.isValid = false;
    state.errorType = 'mask';
    state.errorMessage = (component.label || component.key) + ' must use the format ' + component.inputMask;
  }
  // Custom
  if (state.isValid && component.validate.custom) {
    let custom = component.validate.custom;
    custom = custom.replace(/({{\s+(.*)\s+}})/, (match, $1, $2) => data[$2]);
    const input = item;
    let valid;
    try {
      valid = eval(custom);
      state.isValid = (valid === true);
    }
    catch (e) {
      /* eslint-disable no-console */
      console.warn('A syntax error occurred while computing custom values in ' + component.key, e);
      /* eslint-enable no-console */
    }
    if (!state.isValid) {
      state.errorType = 'custom';
      state.errorMessage = valid;
    }
  }
  return state;
};

export const validate = (value, component, data, validateCustom) => {
  let state = {
    isValid: true,
    errorType: '',
    errorMessage: ''
  };

  // Allow components to have custom validation.
  if (typeof validateCustom === 'function') {
    const customValidation = validateCustom(value);
    if (!customValidation.isValid) {
      state.isValid = false;
      state.errorType = 'day';
      state.errorMessage = customValidation.errorMessage;
    }
  }
  // Validate each item if multiple.
  if (component.multiple) {
    const items = [];
    value.forEach(item => {
      if (state.isValid) {
        state = validateItem(item, component, data);
        items.push(state.item);
      }
      state.item = items;
    });

    if (component.validate && component.validate.required && (!(value instanceof Array) || value.length === 0)) {
      state.isValid = false;
      state.errorType = 'required';
      state.errorMessage = (component.label || component.key) + ' is required.';
    }
  }
  else {
    state = validateItem(value, component, data);
  }
  return state;
};
