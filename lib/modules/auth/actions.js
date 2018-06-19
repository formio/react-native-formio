'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.setUser = exports.init = undefined;

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestUser = function requestUser() {
  return {
    type: types.USER_REQUEST
  };
};

var receiveUser = function receiveUser(user) {
  return {
    type: types.USER_REQUEST_SUCCESS,
    user: user
  };
};

var failUser = function failUser(err) {
  return {
    type: types.USER_REQUEST_FAILURE,
    err: err
  };
};

var logoutUser = function logoutUser() {
  return {
    type: types.USER_LOGOUT
  };
};

var submissionAccessUser = function submissionAccessUser(submissionAccess, roles) {
  return {
    type: types.USER_SUBMISSION_ACCESS,
    submissionAccess: submissionAccess,
    roles: roles
  };
};

var formAccessUser = function formAccessUser(formAccess) {
  return {
    type: types.USER_FORM_ACCESS,
    formAccess: formAccess
  };
};

var getAccess = function getAccess(dispatch) {
  var projectUrl = _formiojs2.default.getProjectUrl();
  _formiojs2.default.makeStaticRequest(projectUrl + '/access').then(function (result) {
    var submissionAccess = {};
    Object.keys(result.forms).forEach(function (key) {
      var form = result.forms[key];
      submissionAccess[form.name] = {};
      form.submissionAccess.forEach(function (access) {
        submissionAccess[form.name][access.type] = access.roles;
      });
    });
    dispatch(submissionAccessUser(submissionAccess, result.roles));
  }).catch(function (err) {
    //console.error(err);
  });
  _formiojs2.default.makeStaticRequest(projectUrl).then(function (project) {
    var formAccess = {};
    project.access.forEach(function (access) {
      formAccess[access.type] = access.roles;
    });
    dispatch(formAccessUser(formAccess));
  }).catch(function (err) {
    //console.error(err);
  });
};

var init = exports.init = function init() {
  return function (dispatch) {
    dispatch(requestUser());

    _formiojs2.default.currentUser().then(function (user) {
      if (user) {
        dispatch(receiveUser(user));
        getAccess(dispatch);
      }
    }).catch(function (result) {
      dispatch(failUser(result));
    });
  };
};

var setUser = exports.setUser = function setUser(user) {
  _formiojs2.default.setUser(user);
  return function (dispatch) {
    dispatch(receiveUser(user));
    getAccess(dispatch);
  };
};

var logout = exports.logout = function logout() {
  return function (dispatch, getState) {
    _formiojs2.default.logout().then(function () {
      dispatch(logoutUser());
      getAccess(dispatch, getState);
    });
  };
};