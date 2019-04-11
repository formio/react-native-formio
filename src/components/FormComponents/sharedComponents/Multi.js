import React from 'react';
import clone from 'lodash/clone';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import Tooltip from './Tooltip';
import ValueComponent from './Value';
import DeviceInfo from 'react-native-device-info';
import {
  Icon,
  Button,
  FormValidationMessage,
  Text,
  FormLabel
} from 'react-native-elements';

export default class MultiComponent extends ValueComponent {
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

  getTableRows(value, id, style) {
    const error = this.state.isPristine || value.isValid ? false : true;
    const Element = this.getSingleElement(value, id, error);
    const errorText = error ? (<FormValidationMessage style={style.errorMessage}> {value.errorMessage}</FormValidationMessage>) : null;
    return (
      <View style={style.fieldWrapper}>
        {Element}
        <Icon name='minus-circle' type='font-awesome' onPress={this.removeFieldValue.bind(null, id)} />
        {errorText}
      </View>
    );
  }

  elementLayout(position) {
    switch (position) {
      case 'top':
       return {
          flexDirection: 'column',
        };
      case 'left-left':
      case 'left-right':
        return {
          flexDirection: 'row',
          alignItems: 'flex-start',
        };
      case 'right-left':
      case 'right-right':
        return {
          flexDirection: 'row-reverse',
          marginHorizontal: 20,
        };
      case 'bottom':
        return {
          flexDirection: 'column-reverse',
        };
      default:
        return {
          flexDirection: 'column',
        };
    }
  }

  getElements() {
    const multiStyles = StyleSheet.create({
      fieldWrapper: {
        flex: 1,
      },
      mainElement: this.elementLayout(this.props.component.labelPosition),
      labelWrapper: {
        flexDirection: 'row',
        marginTop: this.props.component.labelPosition === 'top' || this.props.component.labelPosition === 'bottom' ? 0 : 15,
        marginRight: this.props.component.labelPosition === 'left-left' || this.props.component.labelPosition === 'left-right' ? 10 : 0,
      },
      errorText: {
        alignSelf: 'flex-end',
        fontSize: 10,
        color: this.props.colors.errorColor
      },
      descriptionText: {
        fontSize: DeviceInfo.isTablet() ? 12 : 10,
        marginLeft: 20,
        marginTop: 10,
      },
      labelStyle: {
        flexWrap: 'wrap',
        maxWidth: DeviceInfo.isTablet() ? 580 : 210,
        color: this.props.theme.Label.color,
        fontSize: DeviceInfo.isTablet() ? this.props.theme.Label.fontSize : 12,
      }
    });

    const {component} = this.props;
    let Component;
    const requiredInline = ((component.hideLabel === true || component.label === '' ||
      !component.label) && component.validate && component.validate.required ? <Icon name='asterisk' type='font-awesome'/> : <Text>{''}</Text>);

    const prefix = (<Text>{component.prefix}</Text>);
    const suffix = (<Text>{component.suffix}</Text>);
    const inputLabel = (component.label && !component.hideLabel ?
      <FormLabel labelStyle={multiStyles.labelStyle}>{requiredInline} {prefix} {component.label} {suffix}</FormLabel> : null);

      const data = this.state.value || {};
    if (component.multiple) {
      const rows = data.map((value, id) => {
        this.getTableRows(value, id, multiStyles);
      });
      Component = (
          <View>
            <Text h3>{component.label}</Text>
            {rows}
            <Button icon={{name: 'plus', type: 'font-awesome'}} onPress={this.addFieldValue}> Add another</Button>
          </View>
      );
    }
    else {
      const error = this.state.isPristine || data.isValid ? false : true;
      const Element = this.getSingleElement(data, 0, error);
      const errorText = error ? (<FormValidationMessage>{data.errorMessage}</FormValidationMessage>) : null;

      Component = (
        <View style={multiStyles.fieldWrapper}>
          <View style={multiStyles.mainElement}>
            <View style={multiStyles.labelWrapper}>
            {inputLabel}
            {!!component.tooltip && <Tooltip
              text={component.tooltip}
              color={this.props.colors.alternateTextColor}
              backgroundColor={this.props.colors.primary1Color}
            />}
            </View>
            {Element}
          </View>
          {errorText}
          {!!component.description && <Text style={multiStyles.descriptionText}>{component.description}</Text>}
        </View>
      );
    }
    return Component;
  }
}

MultiComponent.propTypes = {
  component: PropTypes.any,
  onChange: PropTypes.func,
  theme: PropTypes.object,
  colors: PropTypes.object
};
