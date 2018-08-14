import React from 'react';
import Datetime from '../datetime/Datetime';
import moment from 'moment';

export default class Day extends Datetime {
  constructor(props) {
    super(props);
    this.validateCustom = this.validateCustom.bind(this);
    this.customState = this.customState.bind(this);
    this.willReceiveProps = this.willReceiveProps.bind(this);
  }

  validateCustom(value) {
    let state = {
      isValid: true,
      errorType: '',
      errorMessage: '',
      item: value,
    };
    if (!this.props) {
      return state;
    }
    const required = this.props.component.fields.day.required || this.props.component.fields.month.required || this.props.component.fields.year.required;
    if (!required) {
      return state;
    }
    if (!value && required) {
      state = {
        isValid: false,
        errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.',
        item: value,
      };
    }
    const parts = value.split('/');
    if (this.props.component.fields.day.required) {
      if (parts[(this.props.component.dayFirst ? 0 : 1)] === '00') {
        state = {
          isValid: false,
          errorType: 'day',
          errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.',
          item: value,
        };
      }
    }
    if (this.props.component.fields.month.required) {
      if (parts[(this.props.component.dayFirst ? 1 : 0)] === '00') {
        state = {
          isValid: false,
          errorType: 'day',
          errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.',
          item: value,
        };
      }
    }
    if (this.props.component.fields.year.required) {
      if (parts[2] === '0000') {
        state = {
          isValid: false,
          errorType: 'day',
          errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.',
          item: value,
        };
      }
    }
    return state;
  }

  customState(state) {
    let dateItem;
    const dateFormat = this.props.component.dateFirst ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
    state.date = {
      day: '',
      month: '',
      year: ''
    };

    if (state.value.item) {
      dateItem = state.value.item;
    }
    else {
      dateItem = moment(state.value).format(dateFormat).toString();
    }

    if (dateItem) {
      const parts = dateItem.split(/\//g);
      state.date.day = parseInt(parts[(this.props.component.dayFirst ? 0 : 1)]).toString();
      state.date.month = parseInt(parts[(this.props.component.dayFirst ? 1 : 0)]).toString();
      state.date.year = parseInt(parts[2]).toString();
    }
    return state;
  }

  willReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      if (!nextProps.value) {
        return;
      }
      const parts = nextProps.value.item ? nextProps.value.item.split('/') : ['', '', ''];
      this.setState({
        date: {
          day: parts[(this.props.component.dayFirst ? 0 : 1)],
          month: parseInt(parts[(this.props.component.dayFirst ? 1 : 0)]).toString(),
          year: parts[2]
        }
      });
    }
  }
}
