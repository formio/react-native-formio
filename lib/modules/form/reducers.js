'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.formReducer = formReducer;
exports.formsReducer = formsReducer;

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function formReducer(config) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      id: '',
      isFetching: false,
      lastUpdated: 0,
      form: {},
      error: ''
    };
    var action = arguments[1];

    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.FORM_REQUEST:
        return _extends({}, state, {
          isFetching: true,
          id: action.id,
          error: ''
        });
      case types.FORM_SUCCESS:
        return _extends({}, state, {
          id: action.form._id,
          form: action.form,
          isFetching: false,
          error: ''
        });
      case types.FORM_FAILURE:
        return _extends({}, state, {
          isFetching: false,
          isInvalid: true,
          error: action.error
        });
      default:
        return state;
    }
  };
}

function formsReducer(config) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      tag: '',
      isFetching: false,
      lastUpdated: 0,
      forms: [],
      limit: 100,
      pagination: {
        page: 1
      },
      error: ''
    };
    var action = arguments[1];

    // Only proceed for this forms.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.FORMS_REQUEST:
        return _extends({}, state, {
          limit: action.limit || state.limit,
          tag: action.tag,
          isFetching: true,
          pagination: {
            page: action.page || state.pagination.page
          },
          error: ''
        });
      case types.FORMS_SUCCESS:
        return _extends({}, state, {
          forms: action.forms,
          pagination: {
            page: state.pagination.page,
            numPages: Math.ceil(action.forms.serverCount / state.limit),
            total: action.forms.serverCount
          },
          isFetching: false,
          error: ''
        });
      case types.FORMS_FAILURE:
        return _extends({}, state, {
          isFetching: false,
          isInvalid: true,
          error: action.error
        });
      default:
        return state;
    }
  };
}