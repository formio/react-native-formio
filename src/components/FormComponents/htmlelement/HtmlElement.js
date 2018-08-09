import React from 'react';
import {View} from 'react-native';
import BaseComponent from '../sharedComponents/Base';
import H3 from '../h3/H3';
import styles from './styles';

export default class Content extends BaseComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.content}>
        <H3>{this.props.component.content}</H3>
      </View>
    );
  }
}
