import React from 'react';
import MultiComponent from './Multi';
import {StyleSheet} from 'react-native';
import {TextMask} from 'react-text-mask-hoc/ReactNative';
import {clone} from 'lodash';
import {FormInput} from 'react-native-elements';
import PropTypes from 'prop-types';

export default class InputComponent extends MultiComponent {
  constructor(props) {
    super(props);
    this.timeout = null;

    this.customState =this.customState.bind(this);
    this.triggerChange =this.triggerChange.bind(this);
    this.onChangeInput =this.onChangeInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.getInputMask =this.getInputMask.bind(this);
    this.getSingleElement =this.getSingleElement.bind(this);
  }

  customState(state) {
    state.hasChanges = false;
    return state;
  }

  triggerChange() {
    if (typeof this.props.onChange === 'function' && this.state.hasChanges) {
      this.props.onChange(this);
      this.setState({
        hasChanges: false,
      }, () => this.props.onChange(this));
    }
  }

  onChangeInput(value) {
    // Allow components to respond to onChange event.
    if (typeof this.onChangeCustom === 'function') {
      value = this.onChangeCustom(value);
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.triggerChange();
    }, 500);

    let newValue;
    if (Array.isArray(this.state.value)) {
      // Clone so we keep state immutable.
      newValue = clone(this.state.value);
    }
    else {
      newValue = value;
    }
    const validatedValue = this.validate(newValue);

    this.setState({
      isPristine: false,
      hasChanges: true,
      value: validatedValue,
    });
  }

  onBlur() {
    this.triggerChange();
  }
  /**
   * Returns an input mask that is compatible with the input mask library.
   * @param {string} mask - The Form.io input mask.
   * @returns {Array} - The input mask for the mask library.
   */
  getInputMask(mask) {
    if (typeof this.customMask === 'function') {
      return this.customMask();
    }
    if (!mask) {
      return false;
    }
    if (mask instanceof Array) {
      return mask;
    }
    let maskArray = [];
    for (let i=0; i < mask.length; i++) {
      switch (mask[i]) {
        case '9':
          maskArray.push(/\d/);
          break;
        case 'a':
        case 'A':
          maskArray.push(/[a-zA-Z]/);
          break;
        case '*':
          maskArray.push(/[a-zA-Z0-9]/);
          break;
        default:
          maskArray.push(mask[i]);
          break;
      }
    }
    return maskArray;
  }

  getSingleElement(value, index, error) {
    const themeStyle = this.props.theme.Input;
    const style = StyleSheet.create({
      container: {
        borderColor: error ? themeStyle.borderColorOnError : themeStyle.borderColor,
      },
      input: {
        color: themeStyle.color,
        fontSize: themeStyle.fontSize,
        lineHeight: themeStyle.lineHeight,
      }
    });

    index = index || 0;
    const item = typeof value === 'string' ? value : value.item;
    const {component, name, readOnly} = this.props;
    const mask = component.inputMask || '';
    const properties = {
      type: component.inputType !== 'number' ? component.inputType : 'text',
      key: index,
      id: component.key,
      'data-index': index,
      name: name,
      shake: true,
      defaultValue: item,
      value: item,
      editable: !readOnly,
      placeholder: component.placeholder,
      placeholderTextColor: this.props.theme.Input.placeholderTextColor,
      onChangeText: this.onChangeInput,
      onBlur: this.onBlur,
      ref: input => this.element = input
    };

    if (mask || component.type === 'currency' || component.type === 'number') {
      properties.inputMode = 'number';
      properties.mask = this.getInputMask(mask);
      properties.placeholderChar = '_';
      properties.guide = true;

      return (<TextMask style={style.input} Component={FormInput} {...properties}/>);
    }
    else {
      return (<FormInput  inputStyle={style.input} containerStyle={style.container} {...properties} />);
    }
  }
}

InputComponent.propTypes = {
  component: PropTypes.any,
  name: PropTypes.string,
  theme: PropTypes.object,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func
};
