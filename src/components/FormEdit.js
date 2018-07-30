import React from 'react';
import {Text} from 'react-native';
import PropTypes from 'prop-types';
import {
  ActionsContainer,
  Button,
  FieldsContainer,
  Form,
  FormGroup,
  Input,
  Label
} from 'react-native-clean-form';
import {FormBuilder} from '../components';

export default class FormEdit extends React.Component {
  static getDerivedStateFromProps(props, state) {
    return {
      form: props.form !== state.form ? props.form : state.form
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      form: props.form
    };
  }

  render() {
    const {onSave, onCancel} = this.props;
    const {form} = this.state;
    const actionTitle = form._id ? 'Save Form' : 'Create Form';
    return (
      <Form>
        <FieldsContainer>
          <FormGroup>
            <Label>Title</Label>
            <Input placeholder={form.title} />
          </FormGroup>
          <FormGroup>
            <Label>Name</Label>
            <Input placeholder={form.name} />
          </FormGroup>
          <FormGroup>
            <Label>Path</Label>
            <Input placeholder={form.path} />
            <Text>The path alias for this form.</Text>
          </FormGroup>
          <FormBuilder src="formUrl"></FormBuilder>
        </FieldsContainer>
        <ActionsContainer className="form-group pull-right">
          <Button
            className="btn btn-default"
            onPress={() => {
              onCancel(form);
            }}
          >
            Cancel
          </Button>
          <Button
          onPress={() => {
            onSave(form);
          }}>
            {actionTitle}
          </Button>
        </ActionsContainer>
      </Form>
    );
  }
}

FormEdit.defaultProps = {
  form: {
    type: 'form'
  },
  onSave: () => null,
  onCancel: () => null
};

FormEdit.propTypes = {
  form: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};
