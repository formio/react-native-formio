'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authReducer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var authReducer = exports.authReducer = function authReducer() {
  var initialState = {
    init: false,
    isFetching: false,
    user: null,
    authenticated: false,
    formAccess: false,
    submissionAccess: false,
    roles: {},
    is: {},
    error: ''
  };

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    // Only proceed for this user.
    switch (action.type) {
      case types.USER_REQUEST:
        return _extends({}, state, {
          init: true,
          submissionAccess: false,
          isFetching: true
        });
      case types.USER_REQUEST_SUCCESS:
        return _extends({}, state, {
          isFetching: false,
          user: action.user,
          authenticated: true,
          error: ''
        });
      case types.USER_REQUEST_FAILURE:
        return _extends({}, state, {
          isFetching: false,
          error: action.error
        });
      case types.USER_SUBMISSION_ACCESS:
        return _extends({}, state, {
          is: Object.keys(action.roles).reduce(function (prev, roleName) {
            return _extends({}, prev, _defineProperty({}, roleName, state.user.roles.indexOf(action.roles[roleName]._id) !== -1));
          }, {}),
          submissionAccess: action.submissionAccess,
          roles: action.roles
        });
      case types.USER_FORM_ACCESS:
        return _extends({}, state, {
          formAccess: action.formAccess
        });
      case types.USER_LOGOUT:
        return _extends({}, state, {
          user: null,
          isFetching: false,
          authenticated: false,
          error: ''
        });
      default:
        return state;
    }
  };
};