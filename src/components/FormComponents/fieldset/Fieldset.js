import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {FormioComponentsList} from '../../';
import H3 from '../h3/H3';
import styles from './styles';

const Fieldset = (props) => {
  const legend = (props.component.legend ? <H3>{props.component.legend}</H3> : null);
  return (
    <View style={styles.fieldset}>
      {legend}
      <FormioComponentsList
        {...props}
        components={props.component.components}
      ></FormioComponentsList>
    </View>
  );
};

Fieldset.propTypes = {
  component: PropTypes.object,
  theme: PropTypes.object,
  colors: PropTypes.object
};

export default Fieldset;

