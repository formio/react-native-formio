import React from 'react';
import {Text, ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import Formiojs from '../formio';
import FormioUtils from '../formio/utils';
import {FormioComponentsList} from '../components';
import clone from 'lodash/clone';
import theme from '../defaultTheme';
import colors from '../defaultTheme/colors';
import '../components/FormComponents';

export default class Formio extends React.Component {
  static getDerivedStateFromProps(props, state) {
    let form = state.form, submission = state.submission;

    if (props.form && props.form !== state.form) {
      form = props.form;
    }
    if (props.submission !== state.submission) {
      if (props.submission && props.submission.data) {
        this.data = clone(props.submission.data);
      }
      submission = props.submission;
    }

    return {
      form,
      submission,
    };
  }

  constructor(props) {
    super(props);
    if (this.props.submission && this.props.submission.data) {
      this.data = clone(this.props.submission.data);
    }
    else {
      this.data = {};
    }
    this.props.options.isInit = true;
    this.inputs = {};
    this.unmounting = false;
    this.state = {
      form: this.props.form || {},
      submission: this.props.submission || {},
      submissions: this.props.submissions || [],
      alerts: [],
      isLoading: (this.props.form ? false : true),
      isSubmitting: false,
      isValid: true,
      isPristine: true
    };
    this.loadForm = this.loadForm.bind(this);
    this.loadSubmission = this.loadSubmission.bind(this);
    this.attachToForm = this.attachToForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.submissionError = this.submissionError.bind(this);
    this.setInputsErrorMessage = this.setInputsErrorMessage.bind(this);
    this.setInputsPristine = this.setInputsPristine.bind(this);
    this.detachFromForm = this.detachFromForm.bind(this);
    this.onEvent = this.onEvent.bind(this);
    this.externalChange = this.externalChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.clearHiddenData = this.clearHiddenData.bind(this);
    this.validate = this.validate.bind(this);
    this.checkConditional = this.checkConditional.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.setPristine = this.setPristine.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentDidUpdate() {
    this.props.options.isInit = this.rerender;
    this.rerender = false;
  }

  componentDidMount() {
    if (this.props.src) {
      this.formio = new Formiojs(this.props.src);
      this.formio.loadForm().then((form) => {
        this.loadForm(form);
      });

      if (this.formio.submissionId) {
        this.formio.loadSubmission().then((submission) => {
          this.loadSubmission(submission);
        });
      }
    }
    else if (this.props.form) {
      this.validate();
    }
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  loadForm(form) {
    this.rerender = true;
    if (typeof this.props.onFormLoad === 'function') {
      this.props.onFormLoad(form);
    }
    this.setState({
      form: form,
      isLoading: false
    }, this.validate);
  }

  loadSubmission(submission) {
    if (typeof this.props.onSubmissionLoad === 'function') {
      this.props.onSubmissionLoad(submission);
    }
    this.data = clone(submission.data);
    this.setState({
      submission: submission
    }, this.validate);
  }

  attachToForm(component) {
    this.inputs[component.props.component.key] = component;
    this.validate();
  }

  detachFromForm(component) {
    let sendChange = false;
    // Don't detach when the whole form is unmounting.
    if (this.unmounting) {
      return;
    }
    delete this.inputs[component.props.component.key];
    if (!component.props.component.hasOwnProperty('clearOnHide') || component.props.component.clearOnHide !== false) {
      if (this.data && this.data.hasOwnProperty(component.props.component.key)) {
        delete this.data[component.props.component.key];
        sendChange = true;
      }
    }
    this.validate(() => {
      if (sendChange) {
        this.externalChange(component);
      }
    });
  }

  submitForm(method, submission) {
    if (typeof this.props.onFormSubmit === 'function') {
      this.props.onFormSubmit(submission);
    }
    this.setState({
      isSubmitting: false,
      alerts: [{
        type: 'success',
        message: 'Submission was ' + ((method === 'put') ? 'updated' : 'created')
      }]
    });
  }

  submissionError(response) {
    if (typeof this.props.onFormError === 'function') {
      this.props.onFormError(response);
    }
    this.setState({
      isSubmitting: false
    });
    if (response.hasOwnProperty('name') && response.name === 'ValidationError') {
      response.details.forEach(this.setInputsErrorMessage);
    }
    else {
      this.showAlert('danger', response);
    }
  }

  setInputsErrorMessage(detail) {
    if (this.inputs[detail.path]) {
      this.inputs[detail.path].setState({
        isValid: false,
        isPristine: false,
        errorMessage: detail.message
      });
    }
  }

  setInputsPristine(name, isPristine) {
    this.inputs[name].setState({
      isPristine
    });
    if (typeof this.inputs[name].setPristine === 'function') {
      this.inputs[name].setPristine(isPristine);
    }
  }

  onEvent(event) {
    if (typeof this.props.onEvent === 'function') {
      this.props.onEvent.apply(null, [event, this.data, ...Array.prototype.slice.call(arguments, 1, arguments.length)]);
    }
  }

  externalChange(component, context) {
    if (typeof this.props.onChange === 'function' && !this.props.readOnly) {
      this.props.onChange({data: this.data}, component, context);
    }
  }

  onChange(component, context={}) {
    // Datagrids and containers are different.
    if (context.hasOwnProperty('datagrid')) {
      this.data[context.datagrid.props.component.key] = context.datagrid.state.value;
    }
    else if (context.hasOwnProperty('container')) {
      this.data[context.container.props.component.key] = context.container.state.value;
    }
    else {
      if (component.state.value === null) {
        delete this.data[component.props.component.key];
      }
      else {
        this.data[component.props.component.key] = component.state.value;
      }
    }
    this.validate(() => {
      this.externalChange(component, context);
    });
    // If a field is no longer pristine, the form is no longer pristine.
    if (!component.state.isPristine && this.state.isPristine) {
      this.setState({
        isPristine: false
      });
    }
  }

  validate(next) {
    let allIsValid = true;
    const inputs = this.inputs;

    Object.keys(inputs).forEach((name) => {
      if (!inputs[name].state.isValid) {
        allIsValid = false;
      }
    });

    this.setState({
      isValid: allIsValid
    }, next);

    return allIsValid;
  }

  clearHiddenData(component) {
    if (!component.hasOwnProperty('clearOnHide') || component.clearOnHide !== false) {
      if (this.data.hasOwnProperty(component.key)) {
        delete this.data[component.key];
        this.externalChange({props: {component}, state: {isPristine: true, value: null}});
      }
    }
    if (component.hasOwnProperty('components')) {
      component.components.forEach(component => {
        this.clearHiddenData(component);
      });
    }
    if (component.hasOwnProperty('columns')) {
      component.columns.forEach(column => {
        column.components.forEach(component => {
          this.clearHiddenData(component);
        });
      });
    }
    if (component.hasOwnProperty('rows') && Array.isArray(component.rows)) {
      component.rows.forEach(column => {
        column.forEach(component => {
          this.clearHiddenData(component);
        });
      });
    }
  }

  checkConditional(component, row={}) {
    const show = FormioUtils.checkCondition(component, row, this.data);

    // If element is hidden, remove any values already on the form (this can happen when data is loaded into the form
    // and the field is initially hidden.
    if (!show) {
      // Recursively delete data for all components under this component.
      this.clearHiddenData(component);
    }

    return show;
  }

  isDisabled(component) {
    return this.props.readOnly ||
    (Array.isArray(this.props.disableComponents) && this.props.disableComponents.indexOf(component.key) !== -1) ||
    component.disabled;
  }

  showAlert(type, message, clear) {
    this.setState((previousState) => {
      if (clear) {
        previousState.alerts = [];
      }
      previousState.alerts = previousState.alerts.concat({type: type, message: message});
      return previousState;
    });
  }

  setPristine(isPristine) {
    // Mark all inputs as dirty so errors show.
    Object.keys(this.inputs).forEach((name) => {
      this.setInputsPristine(name, isPristine);
    });
    this.setState({
      isPristine
    });
  }

  onSubmit(event) {
    event.preventDefault();

    this.setPristine(false);

    if (!this.state.isValid) {
      this.showAlert('danger', 'Please fix the following errors before submitting.', true);
      return;
    }

    this.setState({
      alerts: [],
      isSubmitting: true
    });
    const sub = this.state.submission;
    sub.data = clone(this.data);

    let request;
    let method;
    // Do the submit here.
    if (this.state.form.action) {
      method = this.state.submission._id ? 'put' : 'post';
      request = Formiojs.request(this.state.form.action, method, sub);
    }
    else if (this.formio) {
      request = this.formio.saveSubmission(sub);
    }

    if (request) {
      request.then((submission) => {
        this.submitForm(method, submission);
      })
      .catch((response) => {
        this.submissionError(response);
      });
    }
    else {
      if (typeof this.props.onFormSubmit === 'function') {
        this.props.onFormSubmit(sub);
      }
      this.setState({
        alerts: [],
        isSubmitting: false
      });
    }
  }

  resetForm() {
    this.setState((previousState) => {
      for (let key in previousState.submission.data) {
        delete previousState.submission.data[key];
      }
      return previousState;
    });
  }

  render() {
    if (!this.state.form || !this.state.form.components) {
      return null;
    }
    const components = this.state.form.components;
    const alerts = this.state.alerts.map((alert, index) => {
      // const className = 'alert alert-' + alert.type;
      return (<Text key={index}>{alert.message}</Text>);
    });

    const style = StyleSheet.create({
      formWrapper: {
        flex: 1,
        ...this.props.theme.Main
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40%'
      },
      loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
      }
    });

    const loading = (
      <View style={style.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={this.props.colors.primary1Color}
          style={style.loading}
        />
      </View>
    );

    return (
      <ScrollView style={style.formWrapper}>
        {this.state.isLoading && loading}
        {alerts}
        {!this.state.isLoading && <FormioComponentsList
          components={components}
          values={this.data}
          options={this.props.options}
          attachToForm={this.attachToForm}
          detachFromForm={this.detachFromForm}
          isSubmitting={this.state.isSubmitting}
          isFormValid={this.state.isValid}
          onElementRender={this.props.onElementRender}
          theme={this.props.theme}
          colors={this.props.colors}
          resetForm={this.resetForm}
          formio={this.formio}
          data={this.data}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          onEvent={this.onEvent}
          isDisabled={this.isDisabled}
          checkConditional={this.checkConditional}
          showAlert={this.showAlert}
          formPristine={this.state.isPristine}
        />}
      </ScrollView>
    );
  }
}

Formio.defaultProps = {
  readOnly: false,
  formAction: false,
  options: {},
  theme: theme,
  colors: colors
};

Formio.propTypes = {
  src: PropTypes.string,
  form: PropTypes.object,
  submission: PropTypes.object,
  submissions: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
  readOnly: PropTypes.bool,
  theme: PropTypes.object,
  colors: PropTypes.object,
  style: PropTypes.object,
  disableComponents: PropTypes.array,
  onElementRender: PropTypes.func,
  onFormLoad: PropTypes.func,
  onSubmissionLoad: PropTypes.func,
  onFormSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onEvent: PropTypes.func,
  onFormError: PropTypes.func,
};
