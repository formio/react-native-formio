import React from 'react';
import BaseComponent from '../sharedComponents/Base';
import {Button as ButtonElement} from 'react-native-elements';
import styles from './styles';
export default class Button extends BaseComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.getButtonType = this.getButtonType.bind(this);
  }

  getButtonType() {
    switch (this.props.component.action) {
      case 'submit':
      case 'saveState':
        return 'submit';
      case 'reset':
        return 'reset';
      case 'event':
      case 'oauth':
      default:
        return 'button';
    }
  }

  onClick(event) {
    if (this.props.readOnly) {
      event.preventDefault();
      this.props.resetForm();
      return;
    }
    switch (this.props.component.action) {
      case 'submit':
      case 'saveState':
        this.props.onSubmit(event);
        break;
      case 'event':
        this.props.onEvent(this.props.component.event);
        break;
      case 'oauth':
        /* eslint-disable no-console */
        console.warn('You must add the OAuth button to a form for it to function properly');
        /* eslint-enable no-console */
        break;
      case 'delete':
        this.props.onEvent('deleteSubmission');
        break;
      case 'reset':
        event.preventDefault();
        this.props.resetForm();
        break;
    }
  }

  render() {
    this.props.readOnly;
    this.props.component.theme;
    const disabled = this.props.readOnly || this.props.isSubmitting || (this.props.component.disableOnInvalid && !this.props.isFormValid);
    const submitting = this.props.isSubmitting && this.props.component.action === 'submit';

    const leftIcon = this.props.component.leftIcon ? {name: this.props.component.leftIcon, type: 'font-awesome'} : null;
    const rightIcon = this.props.component.rightIcon ? {name: this.props.component.rightIcon, type: 'font-awesome'} : null;
    return (
      <ButtonElement
        containerViewStyle={styles.button}
        backgroundColor={this.props.colors.primary1Color}
        large={this.props.component.block ? true : false}
        title={this.props.component.label}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        type={this.getButtonType()}
        disabled={disabled}
        onPress={this.onClick}
        loading={submitting}
      />
    );
  }
}
