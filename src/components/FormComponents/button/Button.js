import React from 'react';
import {StyleSheet} from  'react-native';
import BaseComponent from '../sharedComponents/Base';
import {Button as ButtonElement} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';

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
    let buttonWidth;
    const {component} = this.props;
    if (component.block) {
      buttonWidth = '100%';
    }
 else {
      buttonWidth = DeviceInfo.isTablet() ? 250 : 150;
    }

    const styles = StyleSheet.flatten({
      button: {
        width: buttonWidth,
        alignSelf: 'center',
        marginHorizontal: 10,
        paddingHorizontal: component.block ? 20 : 0,
        marginTop: 20,
        marginBottom: 10
      },
    });

    const getIconName = (value) => value.split(' ')[1].split('-')[1];
    const disabled = this.props.readOnly || this.props.isSubmitting || (component.disableOnInvalid && !this.props.isFormValid);
    const submitting = this.props.isSubmitting && component.action === 'submit';

    const leftIcon = component.leftIcon ? {name: getIconName(component.leftIcon), type: 'font-awesome'} : null;
    const rightIcon = component.rightIcon ? {name: getIconName(component.rightIcon), type: 'font-awesome'} : null;

    return (
      <ButtonElement
        containerViewStyle={styles.button}
        backgroundColor={this.props.colors.primary1Color}
        title={component.label}
        large={component.size === 'lg' ? true : false}
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
