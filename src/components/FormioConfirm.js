import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';

const FormioConfirm = (props) => {
  const buttonElements = props.buttons.map((button, index) => {
    return (
      <Text key={index} onClick={button.callback} className={button.class}>{ button.text }</Text>
    );
  });
  return (
    <View>
      <Text>{ props.message}</Text>
      <View className="btn-toolbar">
        {buttonElements}
      </View>
    </View>
  );
};

FormioConfirm.propTypes = {
  message: PropTypes.string,
  buttons: PropTypes.array,
};

export default FormioConfirm;
