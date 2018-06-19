'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formActions = formActions;

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { AlertActions } from '../../FormioAlerts/actions';

function requestForm(name, id) {
  return {
    type: types.FORM_REQUEST,
    name: name,
    id: id
  };
}

function receiveForm(name, form) {
  return {
    type: types.FORM_SUCCESS,
    form: form,
    name: name
  };
}

function failForm(name, err) {
  return {
    type: types.FORM_FAILURE,
    error: err,
    name: name
  };
}

function requestForms(name, tag) {
  return {
    type: types.FORMS_REQUEST,
    name: name,
    tag: tag
  };
}

function receiveForms(name, forms) {
  return {
    type: types.FORMS_SUCCESS,
    forms: forms,
    name: name
  };
}

function failForms(name, err) {
  return {
    type: types.FORMS_FAILURE,
    error: err,
    name: name
  };
}

function formActions(form) {
  return {
    get: function get() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return function (dispatch, getState) {
        // Check to see if the form is already loaded.
        var root = form.selectors.getForm(getState());
        if (root.form.components && root.form.id === id) {
          return;
        }

        dispatch(requestForm(form.config.name, id));

        var formPath = form.config.form || 'form/' + id;

        var formioForm = new _formiojs2.default(form.config.projectUrl + '/' + formPath);

        return formioForm.loadForm().then(function (result) {
          dispatch(receiveForm(form.config.name, result));
        }).catch(function (result) {
          //dispatch(AlertActions.add({
          //  type: 'danger',
          //  message: result
          //}));
          dispatch(failForm(form.config.name, result));
        });
      };
    },
    index: function index(tag) {
      var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      return function (dispatch, getState) {
        dispatch(requestForms(form.config.name, tag, page));
        var forms = form.selectors.getForms(getState());

        var params = {};
        if (tag) {
          params.tags = tag;
        }
        if (parseInt(forms.limit) !== 10) {
          params.limit = forms.limit;
        }
        if (page !== 1) {
          params.skip = (parseInt(page) - 1) * parseInt(forms.limit);
          params.limit = parseInt(forms.limit);
        }
        var formio = new _formiojs2.default(form.config.projectUrl + '/form');

        return formio.loadForms({ params: params }).then(function (result) {
          dispatch(receiveForms(form.config.name, result));
        }).catch(function (result) {
          dispatch(failForms(form.config.name, result));
        });
      };
    }
  };
}