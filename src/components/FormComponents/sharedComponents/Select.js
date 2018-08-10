import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
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
    this.getElements = this.getElements.bind(this);
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

  getElements() {
    let Element;
    const properties = {
      options: this.state.selectItems.filter(value => {
        if (typeof value === 'object' && this.valueField()) {
          value = get(value, this.valueField());
        }
        return this.state.value !== value;
      }),
      placeholder: this.props.component.placeholder,
      selectedValue: this.state.value,
      enabled: !this.props.readOnly,
      onValueChange: this.onChangeSelect,
      mode: 'dropdown',
    };

    properties.label = this.props.component.label && !this.props.component.hideLabel ? this.props.component.label : '';
    const requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ? <Icon name='asterisk' /> : '');
    if (this.props.component.multiple) {
      Element = <Picker {...properties}/>;
    }
    else {
      Element = <Picker {...properties}/>;
    }
    return (
      <View>
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
