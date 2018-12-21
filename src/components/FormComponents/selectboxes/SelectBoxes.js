import React from 'react';
import {View, Text} from 'react-native';
import SelectBoxes from 'react-native-select-multiple';
import ValueComponent from '../sharedComponents/Value';
import styles from './styles';

export default class SelectBox extends ValueComponent {
  constructor(props) {
    super(props);

    this.getInitialValue = this.getInitialValue.bind(this);
    this.getElements = this.getElements.bind(this);
    this.getValueDisplay = this.getValueDisplay.bind(this);
    this.onChangeItems = this.onChangeItems.bind(this);
  }

  getInitialValue() {
    return {};
  }

  onChangeItems(selections) {
    const values = this.props.component.values;
    const result = {};
    values.forEach((item) => {
      const isSelected = selections.find((i) => i.value === item.value && i.label === item.label);
      if (isSelected) {
        result[item.value] = true;
      }
      else {
        result[item.value] = false;
      }
    });
    this.setValue(result);
  }

  getElements() {
    const items = this.state.value && this.state.value.item ? this.state.value.item : [];
    const selected = this.props.component.values.filter((item) => items[item.value] === true);

    const classLabel = this.props.component.validate && this.props.component.validate.required ? styles.validateError: styles.label;
    const inputLabel = (
    <Text style={classLabel}>
      {this.props.component.label && !this.props.component.hideLabel ? this.props.component.label  : ''}
    </Text>);

    const requiredInline = (<Text>
      {!this.props.component.label && this.props.component.validate && this.props.component.validate.required ? '*': ''}
    </Text>);

    return (
      <View style={styles.wrapper}>
        {inputLabel} {requiredInline}
        <View key={this.props.component.key}>
          <SelectBoxes
            items={this.props.component.values}
            checkboxStyle={styles.checkbox}
            key={this.props.component.key}
            tintColor={this.props.colors.primary1Color}
            disabled={this.props.readOnly}
            selectedItems={selected}
            onSelectionsChange={this.onChangeItems}
          />
        </View>
      </View>
    );
  }

  getValueDisplay(component, data) {
    if (!data) return '';

    return Object.keys(data)
      .filter((key) => {
        return data[key];
      })
      .map((data) => {
        component.values.forEach((item) => {
          if (item.value === data) {
            data = item.label;
          }
        });
        return data;
      })
      .join(', ');
  }
}
