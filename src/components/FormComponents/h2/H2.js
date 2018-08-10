import React from 'react';
import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';
import styles from './styles';

const H2 = (props) => (
  <Text style={styles.header2}>
    {props.children}
  </Text>
);

H2.propTypes = {
  children: PropTypes.node
};

export default H2;
