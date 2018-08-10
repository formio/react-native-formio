import React from 'react';
import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';
import styles from './styles';

const H3 = (props) => (
  <Text style={styles.header3}>
    {props.children}
  </Text>
);

H3.propTypes = {
  children: PropTypes.node
};

export default H3;

