import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {Dropdown} from 'react-native-material-dropdown';
import {Chip, Selectize} from 'react-native-material-selectize';
import {interpolate} from '../../../util';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import ValueComponent from './Value';

const selectStyle = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 10
  },
  container: {
    zIndex: 1000,
  },
  listText: {
    fontSize: 15,
    lineHeight: 21,
  },
  list: {
    flex: 1,
    position: 'absolute'
  },
  chip: {
    paddingRight: 2
  },
  chipIcon: {
    height: 24,
    width: 24
  },
});

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

  onChipClose(event) {
    console.log(event, 'evENRTTNTNTNTNTNTNTNTN');
  }

  renderChip(id, onClose, item, style, iconStyle) {
    return (
      <Chip
        key={id}
        iconStyle={iconStyle}
        onClose={() => this.onChipClose(onClose)}
        text={id}
        style={style}
      />
    );
  }

  renderRow(id, onPress, item) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        key={id}
        onPress={onPress}
        style={selectStyle.listRow}
      >
        <Text style={selectStyle.listText}>{item.label}</Text>
      </TouchableOpacity>
    );
  }

  getElements() {
    const labelText = this.props.component.label && !this.props.component.hideLabel ? this.props.component.label : 'Select';
    const requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ? <Icon name='asterisk' /> : '');
    const value = this.state.selectItems.find(item => this.state.value && item.value === this.state.value.item) || {};
    let Element;

    if (this.props.component.multiple) {
      Element = (
        <Selectize
          ref={c => this.multipleSelect = c}
          chipStyle={selectStyle.chip}
          chipIconStyle={selectStyle.chipIcon}
          itemId={this.props.component.key}
          items={this.state.selectItems}
          label={labelText}
          listStyle={selectStyle.list}
          containerStyle={selectStyle.container}
          tintColor={this.props.colors.primary1Color}
          renderRow={this.renderRow}
          renderChip={this.renderChip}
        />
      );
    }
    else {
      Element = (
        <Dropdown
          label={`${labelText} ${requiredInline}`}
          data={this.state.selectItems}
          disabled={this.props.readOnly}
          value={value}
          onChangeText={this.onChangeSelect}
          labelFontSize={18}
        />
      );
    }
    return (
      <View style={selectStyle.wrapper}>
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
