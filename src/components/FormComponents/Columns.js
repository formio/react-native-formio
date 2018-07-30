import React from 'react';
import {FormioComponentsList} from '../../components';
import {FormContainer} from 'react-native-clean-form';
import PropTypes from 'prop-types';

const Columns = (props) => (
  <FormContainer theme={props.theme}>
    {props.component.columns.map((column, index) => (
      <FormioComponentsList
        key={index}
        {...props}
        components={column.components}
      />
    ))}
  </FormContainer>
);

Columns.propTypes = {
  component: PropTypes.array,
  theme: PropTypes.any,
};

export default Columns;
