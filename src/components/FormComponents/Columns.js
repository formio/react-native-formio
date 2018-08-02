import React from 'react';
import {FormioComponentsList} from '../../components';
import {Fieldset} from 'react-native-clean-form';
import PropTypes from 'prop-types';

const Columns = (props) => (
  <Fieldset theme={props.theme}>
    {props.component.columns.map((column, index) => (
      <FormioComponentsList
        key={index}
        {...props}
        components={column.components}
      />
    ))}
  </Fieldset>
);

Columns.propTypes = {
  component: PropTypes.object,
  theme: PropTypes.any,
};

export default Columns;
