import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {FormLabel} from 'react-native-elements';
import {interpolate} from '../../../util';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import ValueComponent from './Value';
import {Picker} from 'react-native';

export default class SelectComponent extends ValueComponent {
  constructor(props) {
    super(props);
    this.data = {...this.props.data};
    this.state = {
      selectItems: [],
      searchTerm: '',
      hasNextPage: false,
      open: false
    };
    this.willReceiveProps = this.willReceiveProps.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.valueField = this.valueField.bind(this);
    this.getElements = this.getElements.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.textField = this.textField.bind(this);
  }

  willReceiveProps(nextProps) {
    if (this.props.component.refreshOn && !nextProps.formPristine) {
      const refreshOn = this.props.component.refreshOn;
      this.refresh = false;
      if (refreshOn === 'data') {
        if (!isEqual(this.data, nextProps.data)) {
          this.refresh = true;
        }
      }
      else {
        if ((!this.data.hasOwnProperty(refreshOn) && nextProps.hasOwnProperty(refreshOn)) || this.data[refreshOn] !== nextProps.data[refreshOn]) {
          this.refresh = true;
        }
        else if (nextProps && nextProps.row && nextProps.row.hasOwnProperty(refreshOn) && this.props.row[refreshOn] !== nextProps.row[refreshOn]) {
          this.refresh = true;
        }
      }
      if (this.refresh && this.props.component.clearOnRefresh) {
        this.setValue(this.getDefaultValue());
      }
    }
    if (this.refresh) {
      this.refreshItems();
      this.refresh = false;
    }
    this.data = {...nextProps.data};
  }

  valueField() {
    let valueFieldItem = this.props.component.valueProperty || 'value';
    if (typeof this.getValueField === 'function') {
      valueFieldItem = this.getValueField();
    }
    return valueFieldItem;
  }

  textField() {
    // Default textfield to rendered output.
    let textFieldItem = (item) => {
      if (typeof item !== 'object') {
        return item;
      }
      return interpolate(this.props.component.template, {item: item});
    };
    if (typeof this.getTextField === 'function') {
      textFieldItem = this.getTextField();
    }
    return textFieldItem;
  }

  onChangeSelect(value) {
    if (Array.isArray(value) && this.valueField()) {
      value.forEach(function(val, index) {
        value[index] = (typeof val === 'object' ? get(val, this.valueField()) : val);
      }.bind(this));
    }
    else if (typeof value === 'object' && this.valueField()) {
      value = get(value, this.valueField());
    }
    this.setValue(value);
  }

  onSearch(text) {
    this.setState({
      searchTerm: text
    });
    if (typeof this.refreshItems === 'function') {
      this.refreshItems(text);
    }
  }

  onToggle(isOpen) {
    this.props.onEvent('selectToggle', this, isOpen);
    this.setState(prevState => {
      prevState.open = isOpen;
      return prevState;
    });
  }

  getElements() {
    const selectStyle = StyleSheet.create({
      wrapper: {
        flex: 1,
        marginTop: 10
      },
      label: {
        color: this.props.colors.pickerColor,
        fontSize: 15,
      },
      picker: {
        flex: 1,
        marginTop: -20,
      }
    });
    const properties = {
      placeholder: this.props.component.placeholder,
      selectedValue: this.state.value ? this.state.value.item : '',
      enabled: !this.props.readOnly,
      onValueChange: this.onChangeSelect,
    };

   const labelText = this.props.component.label && !this.props.component.hideLabel ? this.props.component.label : 'Select';
    const requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ? <Icon name='asterisk' /> : '');
    const Element = (
      <Picker {...properties} style={selectStyle.picker}>
        {this.state.selectItems.map((item) => (<Picker.Item key={item.value} label={item.label} value={item.value}/>))}
      </Picker>
    );

    return (
      <View style={selectStyle.wrapper}>
        <FormLabel
          labelStyle={selectStyle.label}
        >
          {labelText}
        </FormLabel>
        {requiredInline}
        {Element}
      </View>
    );
  }
}

SelectComponent.propTypes = {
  data: PropTypes.any,
  component: PropTypes.any,
  row: PropTypes.object,
  readOnly: PropTypes.bool,
  value: PropTypes.any,
  onEvent: PropTypes.func,
};
