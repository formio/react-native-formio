import React from 'react';
import PropTypes from 'prop-types';
import {FieldsContainer} from  'react-native-clean-form';
import {FormioComponents} from '../factories';

const FormioComponentsList = (props) => {
  return (
    <FieldsContainer>
      {props.components.map((component, index) => {
        const key = component.key || component.type + index;
        const value = (props.values && props.values.hasOwnProperty(component.key) ? props.values[component.key] : null);
        const FormioElement = FormioComponents.getComponent(component.type);
        if (!FormioElement) return null;
        if (props.checkConditional(component, props.row)) {
          return (
            <FormioElement
              {...props}
              readOnly={props.isDisabled(component)}
              name={component.key}
              key={key}
              component={component}
              value={value}
            />
          );
        }
        else {
          return null;
        }
      })}
    </FieldsContainer>
  );
};

FormioComponentsList.propTypes = {
  components: PropTypes.array,
  values: PropTypes.any,
  row: PropTypes.any,
  isDisabled: PropTypes.func,
  checkConditional: PropTypes.func,
};

export default FormioComponentsList;
