'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.submissionReducer = submissionReducer;
exports.submissionsReducer = submissionsReducer;

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function submissionReducer(config) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      formId: '',
      id: '',
      isFetching: false,
      lastUpdated: 0,
      submission: {},
      error: ''
    };
    var action = arguments[1];

    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.SUBMISSION_REQUEST:
        return _extends({}, state, {
          formId: action.formId,
          id: action.id,
          submission: {},
          isFetching: true
        });
      case types.SUBMISSION_SAVE:
        return _extends({}, state, {
          formId: action.formId,
          id: action.id,
          submission: {},
          isFetching: true
        });
      case types.SUBMISSION_SUCCESS:
        return _extends({}, state, {
          id: action.submission._id,
          submission: action.submission,
          isFetching: false,
          error: ''
        });
      case types.SUBMISSION_FAILURE:
        return _extends({}, state, {
          isFetching: false,
          isInvalid: true,
          error: action.error
        });
      case types.SUBMISSION_RESET:
        return _extends({}, state, {
          id: '',
          isFetching: false,
          lastUpdated: 0,
          submission: {},
          error: ''
        });
      default:
        return state;
    }
  };
}

function submissionsReducer(config) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      formId: '',
      isFetching: false,
      lastUpdated: 0,
      submissions: [],
      limit: 10,
      page: 0,
      error: ''
    };
    var action = arguments[1];

    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.SUBMISSIONS_REQUEST:
        return _extends({}, state, {
          formId: action.formId,
          limit: action.limit || state.limit,
          isFetching: true,
          submissions: [],
          page: action.page,
          error: ''
        });
      case types.SUBMISSIONS_SUCCESS:
        return _extends({}, state, {
          submissions: action.submissions,
          isFetching: false,
          error: ''
        });
      case types.SUBMISSIONS_FAILURE:
        return _extends({}, state, {
          isFetching: false,
          error: action.error
        });
      default:
        return state;
    }
  };
}