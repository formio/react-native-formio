import React from 'react';
import {FormioComponentsList} from '../../../components';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import styles from './styles';

const Columns = (props) => (
  <View style={{...styles.columns, borderBottomColor: props.colors.borderColor}}>
    {props.component.columns.map((column, index) => (
      <FormioComponentsList
        key={index}
        {...props}
        components={column.components}
      />
    ))}
  </View>
);

Columns.propTypes = {
  component: PropTypes.object,
  theme: PropTypes.any,
  colors: PropTypes.object,
};

export default Columns;
