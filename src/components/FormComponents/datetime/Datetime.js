import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import MultiComponent from '../sharedComponents/Multi';
import {View, Text} from 'react-native';
import {Button} from 'react-native-elements';
import styles from './styles';
import moment from 'moment';

export default class Datetime extends MultiComponent {
  constructor(props) {
    super(props);
    this.getInitialValue = this.getInitialValue.bind(this);
    this.getMode = this.getMode.bind(this);
    this.getDisplayFormat = this.getDisplayFormat.bind(this);
    this.getResultFormat = this.getResultFormat.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.togglePicker = this.togglePicker.bind(this);
    this.getSingleElement = this.getSingleElement.bind(this);
  }

  getInitialValue(value) {
    if (!this.props) {
      return moment().toDate();
    }

     const dateFormat = this.props.component.dateFirst ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
    if (value && value.item && moment(value.item, dateFormat).isValid()) {
      return moment(value.item, dateFormat).toDate();
    }
    else if (this.props.component.defaultDate) {
      return moment(this.props.component.defaultDate, dateFormat).toDate();
    }
    else {
      return moment().toDate();
    }
  }

  getMode() {
    switch (this.props.component.type) {
      case 'datetime':
        return 'datetime';
      case 'day':
        return 'date';
      case 'time':
        return 'time';
      default:
        return 'date';
    }
  }

  getDisplayFormat() {
    switch (this.props.component.type) {
      case 'datetime':
        return 'MMMM DD, YYYY hh:mm A';
      case 'day':
        return 'MMMM DD, YYYY';
      case 'time':
        return 'hh:mm A';
      default:
        return 'MMMM DD, YYYY';
    }
  }

  getResultFormat() {
    const dateFirst = this.props.component.dateFirst;
    switch (this.props.component.type) {
      case 'datetime':
        return dateFirst ? 'DD/MM/YYYY : hh:mm A' : 'MM/DD/YYYY : hh:mm A';
      case 'day':
      return dateFirst ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
      case 'time':
        return 'hh:mm A';
      default:
        return dateFirst ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
    }
  }

  onConfirm(value, index) {
    const selected = moment(value);
    const dateFormat = this.getResultFormat();
    if (selected.isValid()) {
      const date = selected.format(dateFormat).toString();
      this.setValue(date, index);
    }
    else {
      // this fixes date module returning invalid date
      //if confirm button was pressed without touching date picker.
      value = moment().format(dateFormat).toString();
      this.setValue(value.toISOString(), index);
    }
    this.togglePicker();
  }

  togglePicker() {
    this.setState({
      open: !this.state.open
    });
  }

  getSingleElement(value, index) {
    const {component, name, readOnly} = this.props;
    const dateFormat = this.props.component.dateFirst ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
    return (
      <View style={styles.date}>
        {this.state.value && this.state.value.item &&
          <Text style={styles.dateText}>{
            moment(this.state.value.item, dateFormat).format(this.getDisplayFormat())}
        </Text>}
        <Button
        disabled={readOnly}
        onPress={this.togglePicker}
        containerViewStyle={styles.button}
        backgroundColor={this.props.colors.primary1Color}
        title={component.type === 'time' ? 'Select time' : 'Select date'}
        leftIcon={{name: component.type === 'time' ? 'clock-o' : 'calendar', type: 'font-awesome'}}
        />
        <DateTimePicker
          isVisible={this.state.open}
          key="component"
          data-index={index}
          name={name}
          placeholder = {component.placeholder}
          pickerRefCb={(ref) => this.datepicker = ref}
          minuteInterval={this.props.component.timePicker ? this.props.component.timePicker.minuteStep : 5}
          mode={this.getMode()}
          date={this.getInitialValue(value)}
          onCancel={this.togglePicker}
          onConfirm={this.onConfirm}
        />
      </View>
    );
  }
}
