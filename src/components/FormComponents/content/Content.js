import React from 'react';
import {View, Linking} from 'react-native';
import HTMLView from 'react-native-htmlview';
import BaseComponent from '../sharedComponents/Base';
import styles from './styles';

export default class Content extends BaseComponent {

  constructor(props) {
    super(props);
    this.onLinkPress = this.onLinkPress.bind(this);
  }

  onLinkPress(url) {
    Linking.openURL(url)
    .catch((e) => {
      return e;
    });
  }

  render() {
    return (
      <View style={styles.content}>
        <HTMLView
          value={this.props.component.html}
          addLineBreaks={false}
          stylesheet={styles}
          onLinkPress={this.onLinkPress}
        />
      </View>
    );
  }
}
