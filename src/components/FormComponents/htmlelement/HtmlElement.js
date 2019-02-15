import React from 'react';
import {View, Text} from 'react-native';
import BaseComponent from '../sharedComponents/Base';
import H3 from '../h3/H3';
import H2 from '../h2/H2';
import styles from './styles';

const tags = {
  h2: H2,
  h3: H3,
  default: Text
};

export default class HTMLElement extends BaseComponent {

  constructor(props) {
    super(props);
  }

  renderContent() {
    let Tag = tags.default;
    if (tags.hasOwnProperty(this.props.component.tag.toLowerCase())) {
      Tag = tags[this.props.component.tag.toLowerCase()];
    }
    return (<Tag>{this.props.component.content}</Tag>);
  }

  render() {
    return (
      <View style={styles.content}>
       {this.renderContent()}
      </View>
    );
  }
}
