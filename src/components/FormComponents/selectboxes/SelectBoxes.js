import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CheckBox, FormLabel} from 'react-native-elements';
import ValueComponent from '../sharedComponents/Value';
import DeviceInfo from 'react-native-device-info';
import Tooltip from '../sharedComponents/Tooltip';

export default class SelectBox extends ValueComponent {
  constructor(props) {
    super(props);

    this.getInitialValue = this.getInitialValue.bind(this);
    this.selectBoxes = this.selectBoxes.bind(this);
    this.getElements = this.getElements.bind(this);
    this.getValueDisplay = this.getValueDisplay.bind(this);
    this.onChangeItems = this.onChangeItems.bind(this);
  }

  getInitialValue() {
    return [];
  }

  onChangeItems(item) {
    const selectedItems = this.state.value && this.state.value.item ? this.state.value.item : [];
    const itemIndex = selectedItems.findIndex((i) => i === item.value);
    if (itemIndex > -1) { // if item was previously selected, remove it.
      selectedItems.splice(itemIndex, 1);
    }
    else {
      selectedItems.push(item.value);
    }
    this.setValue(selectedItems);
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
          flex: 1,
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

  selectBoxes() {
   const {component} = this.props;
    const boxesStyles = StyleSheet.create({
      boxesWrapper: {
        flex: 1,
        flexDirection: component.inline ? 'row' : 'column',
        flexWrap: 'wrap',
        marginHorizontal: component.inline ? 20 : 0,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderColor: this.props.colors.borderColor,
      },
      checkbox: { //eslint-disable-line react-native/no-color-literals
        backgroundColor: 'transparent',
        zIndex: 0,
        margin: 0,
        borderWidth: 0,
      }
    });

   return (
     <View style={boxesStyles.boxesWrapper}>
        {component.values.map(item => {
          const selectedItems = this.state.value && this.state.value.item ? this.state.value.item : [];
          const isSelected = selectedItems.find((i) => i === item.value);
          const onSelect = () => this.onChangeItems(item);

          return (
            <CheckBox
            key={item.label}
            title={item.label}
            checkedIcon='check-square'
            uncheckedIcon='square-o'
            containerStyle={boxesStyles.checkbox}
            size={26}
            iconRight={component.optionsLabelPosition === 'left'}
            checkedColor={this.props.colors.primary1Color}
            uncheckedColor={this.props.colors.primary1Color}
            checked={!!isSelected}
            onIconPress={onSelect}
          />);
        })}
     </View>
   );
  }

  getElements() {
    const {component} = this.props;
    const selectBoxStyle = StyleSheet.create({
      wrapper: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 20,
      },
      label: {
        flexWrap: 'wrap',
        color: this.props.theme.Label.color,
        fontSize: DeviceInfo.isTablet() ? this.props.theme.Label.fontSize : 12,
      },
      mainElement: this.elementLayout(this.props.component.labelPosition),
      labelWrapper: {
        flexDirection: 'row',
        marginBottom: this.props.component.labelPosition === 'top' ? 10 : 0,
        marginTop: this.props.component.labelPosition === 'bottom' ? 10 : 0,
        marginRight: this.props.component.labelPosition === 'left-left' || this.props.component.labelPosition === 'left-right' ? 10 : 0,
        marginLeft: this.props.component.labelPosition === 'right-left' || this.props.component.labelPosition === 'right-right' ? 10 : 0,
      },
      descriptionText: {
        fontSize: DeviceInfo.isTablet() ? 12 : 10,
        marginLeft: 20,
        marginTop: 10,
      },
    });

    const inputLabel = (
    <FormLabel labelStyle={selectBoxStyle.label}>
      {component.label && !component.hideLabel ? component.label  : ''}
    </FormLabel>);

    const requiredInline = (<Text>
      {!component.label && component.validate && component.validate.required ? '*': ''}
    </Text>);

    return (
      <View style={selectBoxStyle.wrapper}>
         <View style={selectBoxStyle.mainElement}>
          <View style={selectBoxStyle.labelWrapper}>
          {inputLabel}{requiredInline}
          {!!component.tooltip && <Tooltip
            text={component.tooltip}
            color={this.props.colors.alternateTextColor}
            backgroundColor={this.props.colors.primary1Color}
          />}
          </View>
          {this.selectBoxes()}
        </View>
        {!!component.description && <Text style={selectBoxStyle.descriptionText}>{component.description}</Text>}
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
