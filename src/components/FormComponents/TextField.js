import React from 'react';
import {deepEqual} from '../../util';
import PropTypes from 'prop-types';
import {TextMask} from 'react-text-mask-hoc/ReactNative';
import {Input, FormGroup, Fieldset, Button, Label} from 'react-native-clean-form';
import {clone} from 'lodash';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {validate} from './componentUtils/validators';
import {safeSingleToMultiple} from './componentUtils/safeSingleToMultiple';
import {getDefaultValue} from './componentUtils/getDefaultValue';

export default class TextField extends React.Component {
  constructor(props) {
    super(props);
    const value = getDefaultValue(this.props.value, this.props.component, this.props.getInitialValue, this.props.onChangeCustom);
    const valid = this.validate(value);
    this.state = {
      value: value,
      isValid: valid.isValid,
      errorType: valid.errorType,
      errorMessage: valid.errorMessage,
      isPristine: true
    };
    if (typeof this.customState === 'function') {
      this.state = this.customState(this.state);
    }
    this.data = {};
    this.addFieldValue =this.addFieldValue.bind(this);
    this.removeFieldValue =this.removeFieldValue.bind(this);
    this.validate =this.validate.bind(this);
    this.onChange =this.onChange.bind(this);
    this.setValue =this.setValue.bind(this);
    this.getDisplay =this.getDisplay.bind(this);
    this.customState =this.customState.bind(this);
    this.triggerChange =this.triggerChange.bind(this);
    this.onChangeInput =this.onChangeInput.bind(this);
    this.onBlur =this.onBlur.bind(this);
    this.getInputMask =this.getInputMask.bind(this);
    this.getSingleElement =this.getSingleElement.bind(this);
    this.getTableRows =this.getTableRows.bind(this);
    this.getElements =this.getElements.bind(this);
  }

  componentDidMount() {
    this.unmounting = false;
    if (!this.props.options || !this.props.options.skipInit || !this.props.options.isInit) {
      this.setValue(this.state.value, null, true);
    }
    if (typeof this.props.attachToForm === 'function') {
      this.props.attachToForm(this);
    }
  }

  componentWillUnmount() {
    this.unmounting = true;
    if (typeof this.props.detachFromForm === 'function') {
      this.props.detachFromForm(this);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // If a new value is set within state, re-render.
    if (this.state && this.state.hasOwnProperty('value') && this.state.value !== nextState.value) {
      return true;
    }

    // If the pristineness changes without a value change, re-render.
    if (this.state && this.state.hasOwnProperty('isPristine') && this.state.isPristine !== nextState.isPristine) {
      return true;
    }

    // If a new value is passed in, re-render.
    if (this.props.value !== nextProps.value) {
      return true;
    }

    // If the component definition change, re-render.
    if (!deepEqual(this.props.component, nextProps.component)) {
      return true;
    }

    // If component has a custom data source, always recalculate
    if (this.props.component.hasOwnProperty('refreshOn') && this.props.component.refreshOn) {
      return true;
    }

    if (this.state && this.state.hasOwnProperty('searchTerm') && this.state.searchTerm !== nextState.searchTerm) {
      return true;
    }

    if (this.state && this.state.hasOwnProperty('selectItems') && !deepEqual(this.state.selectItems, nextState.selectItems)) {
      return true;
    }

    if (this.state && this.state.hasOwnProperty('open') && this.state.open !== nextState.open) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps) {
    const {component} = prevProps;
    let value;
    if (component.hasOwnProperty('calculateValue') && component.calculateValue) {
      if (!deepEqual(this.data, this.props.data)) {
        this.data = clone(this.props.data);
        try {
          const result = eval('(function(data, row) { const value = [];' + component.calculateValue.toString() + '; return value; })(this.data, this.props.row)');
          if (this.state.value !== result) {
            this.setValue(result);
          }
        }
        catch (e) {
          /* eslint-disable no-console */
          console.warn('An error occurred calculating a value for ' + component.key, e);
          /* eslint-enable no-console */
        }
      }
    }
    if (this.props.value !== this.props.value) {
      value = safeSingleToMultiple(this.props.value, this.props.component);
    }
    // This occurs when a datagrid row is deleted.
    let defaultValue = getDefaultValue(value, this.props.component, this.props.getInitialValue, this.props.onChangeCustom);
    if (value === null && this.state.value !== defaultValue) {
      value = defaultValue;
      this.setState({
        isPristine: true
      });
    }
    if (typeof value !== 'undefined' && value !== null) {
      const valid = this.validate(value);
      this.setState({
        value: value,
        isValid: valid.isValid,
        errorType: valid.errorType,
        errorMessage: valid.errorMessage
      });
    }
    if (typeof this.props.willReceiveProps === 'function') {
      this.props.willReceiveProps(this.props);
    }
  }

  addFieldValue() {
    let value = clone(this.state.value);
    value.push(this.props.component.defaultValue);
    this.setState({
      isPristine: false,
      value: value,
    }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this);
      }
    });
  }

  removeFieldValue(id) {
    let value = clone(this.state.value);
    value.splice(id, 1);
    this.setState({
     isPristine: false,
      value: value,
    }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this);
      }
    });
  }

  validate(value) {
    return validate(value, this.props.component, this.props.data, this.props.validateCustom);
  }

  onChange(event) {
    let value = event.nativeEvent.text;
    // Allow components to respond to onChange event.
    if (typeof this.props.onChangeCustom === 'function') {
      value = this.props.onChangeCustom(value);
    }
    const index = (this.props.component.multiple ?  event.nativeEvent.target : null);
    this.setValue(value, index);
  }

  setValue(value, index, pristine) {
    if (index === undefined) {
      index = null;
    }
    let newValue;
    if (index !== null && Array.isArray(this.state.value)) {
      // Clone so we keep state immutable.
      newValue = clone(this.state.value);
      newValue[index] = value;
    }
    else {
      newValue = value;
    }
    const validatedValue =this.validate(newValue);

    this.setState({
      isPristine: !!pristine,
      value: validatedValue,
    }, () => {
      if (typeof this.props.onChange === 'function') {
        if (!this.state.isPristine || this.props.value !== this.state.value) {
          this.props.onChange(this);
        }
      }
    });
  }

  getDisplay(component, value) {
    if (typeof this.getValueDisplay === 'function') {
      if (Array.isArray(value) && component.multiple && component.type !== 'file') {
        return value.map(this.getValueDisplay.bind(null, component)).join(', ');
      }
      else {
        return this.getValueDisplay(component, value);
      }
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    // If this is still an object, something went wrong and we don't know what to do with it.
    if (typeof value === 'object') {
      return '[object Object]';
    }
    return value;
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
    if (typeof this.props.onChangeCustom === 'function') {
      value = this.props.onChangeCustom(value);
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
    const validatedValue =this.validate(newValue);

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

  getSingleElement(value, index) {
    index = index || 0;
    const item = typeof value === 'string' ? value : value.item;
    const {component, name, readOnly} = this.props;
    const mask = component.inputMask || '';
    const properties = {
      type: component.inputType !== 'number' ? component.inputType : 'text',
      key: index,
      style: component.style,
      id: component.key,
      'data-index': index,
      name: name,
      defaultValue: item,
      value: item,
      editable: !readOnly,
      placeholder: component.placeholder,
      onChange: this.onChange,
      onChangeText: this.onChangeInput,
      onBlur: this.onBlur,
      ref:  input => this.element = input
    };

    if (mask || component.type === 'currency' || component.type === 'number') {
      properties.inputMode = 'number';
      properties.mask = this.getInputMask(mask);
      properties.placeholderChar = '_';
      properties.guide = true;

      return (<TextMask Component={Input} {...properties}/>);
    }
    else {
      return (<Input  theme={this.props.theme} {...properties} />);
    }
  }

  getTableRows(value, id) {
    const Element = this.getSingleElement(value, id);
    const error = this.state.isPristine || value.isValid ? false : true;
    const errorText = (
    <Text style={{color: 'red', alignSelf: 'flex-end', fontSize: 10}}>
      {error ? value.errorMessage: ''}
    </Text>);
    return (
      <FormGroup theme={this.props.theme} error={error} inlineLabel={false} key={id}>
        {Element}
        <Button icon='minus-circle' onPress={this.removeFieldValue.bind(null, id)} />
        {errorText}
      </FormGroup>
    );
  }

  getElements() {
    const {component} = this.props;
    let Component;
    const requiredInline = ((component.hideLabel === true || component.label === '' ||
      !component.label) && component.validate && component.validate.required ? <Icon name='asterisk' /> : '');

    const prefix = (component.prefix ? <Text>{component.prefix}</Text> : '');
    const suffix = (component.suffix ? <Text>{component.suffix}</Text> : '');

    const inputLabel = (component.label && !component.hideLabel ?
      <Label>{requiredInline} {prefix} {component.label} {suffix}</Label> : `${requiredInline} ${prefix} ${suffix}`);

      const data = this.state.value;
    if (component.multiple) {
      const rows = data.map((value, id) => {
        this.getTableRows(value, id);
      });
      Component = (
          <Fieldset theme={this.props.theme} label={component.label}>
            {rows}
            <Button icon='plus' onPress={this.addFieldValue}> Add another</Button>
          </Fieldset>
      );
    }
    else {
      const Element = this.getSingleElement(data);
      const error = this.state.isPristine || data.isValid ? false : true;
      const errorText = (
        <Text style={{color: 'red', alignSelf: 'flex-end', fontSize: 10}}>
          {error ? data.errorMessage: ''}
        </Text>);

      Component = (
        <FormGroup inlineLabel={false} error={error} theme={this.props.theme}>
          {inputLabel}
          {Element}
          {errorText}
        </FormGroup>
      );
    }
    return Component;
  }

  render() {
    let element;
    if (typeof this.props.onElementRender === 'function') {
      element = this.props.onElementRender(this, element);
    }
    element = this.getElements();
   return element;
  }

}

TextField.propTypes = {
  component: PropTypes.any,
  value: PropTypes.any,
  data: PropTypes.any,
  options: PropTypes.object,
  row: PropTypes.any,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  theme: PropTypes.object,
  onEvent: PropTypes.func,
  onChange: PropTypes.func,
  onElementRender: PropTypes.func,
  attachToForm: PropTypes.func,
  detachFromForm: PropTypes.func,
  validateCustom: PropTypes.func,
  getInitialValue: PropTypes.func,
  willReceiveProps: PropTypes.func,
  onChangeCustom: PropTypes.func,

};

