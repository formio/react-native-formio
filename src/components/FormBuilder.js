import React from 'react';
import {View, StyleSheet} from 'react-native';

const formBuilderStyles = StyleSheet.create({
  wrapper: {
    height: '500px'
  }
});

export default class FormBuilder extends React.Component {
  render() {
    return <View style={formBuilderStyles.wrapper}>Form Builder</View>;
  }
}

