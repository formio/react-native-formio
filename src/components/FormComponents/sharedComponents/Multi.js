import React from 'react';
import clone from 'lodash/clone';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PropTypes from 'prop-types';
import {Text} from 'react-native';
import InputComponent from './Input';
import {
  Button,
  Fieldset,
  FormGroup,
  Label
} from 'react-native-clean-form';

export default class MultiComponent extends InputComponent {
  constructor(props) {
    super(props);
    this.addFieldValue = this.addFieldValue.bind(this);
    this.removeFieldValue = this.removeFieldValue.bind(this);
    this.getTableRows = this.getTableRows.bind(this);
    this.getElements = this.getElements.bind(this);
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
}

MultiComponent.propTypes = {
  component: PropTypes.any,
  onChange: PropTypes.func,
  theme: PropTypes.object
};
