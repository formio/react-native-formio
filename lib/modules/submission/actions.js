'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submissionActions = submissionActions;

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requestSubmission(name) {
  return {
    name: name,
    type: types.SUBMISSION_REQUEST
  };
}

function saveSubmission(name, data) {
  return {
    name: name,
    type: types.SUBMISSION_SAVE
  };
}

function receiveSubmission(name, submission) {
  return {
    type: types.SUBMISSION_SUCCESS,
    name: name,
    submission: submission
  };
}

function failSubmission(name, err) {
  return {
    type: types.SUBMISSION_FAILURE,
    name: name,
    error: err
  };
}

function resetSubmission(name) {
  return {
    type: types.SUBMISSION_RESET,
    name: name
  };
}

function requestSubmissions(name, page, formId) {
  return {
    type: types.SUBMISSIONS_REQUEST,
    name: name,
    page: page,
    formId: formId
  };
}

function receiveSubmissions(name, submissions) {
  return {
    type: types.SUBMISSIONS_SUCCESS,
    submissions: submissions,
    name: name
  };
}

function failSubmissions(name, err) {
  return {
    type: types.SUBMISSIONS_FAILURE,
    error: err,
    name: name
  };
}

function submissionActions(form) {
  return {
    get: function get(id) {
      var formId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      return function (dispatch, getState) {
        // Check to see if the submission is already loaded.
        if (getState().id === id) {
          return;
        }

        dispatch(requestSubmission(form.config.name, id, formId));

        var formio = new _formiojs2.default(form.config.projectUrl + '/' + form.config.form + '/submission/' + id);

        formio.loadSubmission().then(function (result) {
          dispatch(receiveSubmission(form.config.name, result));
        }).catch(function (result) {
          dispatch(failSubmission(form.config.name, result));
        });
      };
    },
    save: function save(data) {
      return function (dispatch) {
        dispatch(saveSubmission(form.config.name, data));

        var formio = new _formiojs2.default(form.config.projectUrl + '/' + form.config.form + '/submission');

        formio.saveSubmission(data).then(function (result) {
          dispatch(receiveSubmission(form.config.name, result));
        }).catch(function (result) {
          dispatch(failSubmission(form.config.name, result));
        });
      };
    },
    delete: function _delete(id, formId) {
      return function (dispatch, getState) {
        var formio = new _formiojs2.default(form.config.projectUrl + '/' + form.config.form + '/submission/' + id);
        return formio.deleteSubmission().then(function () {
          dispatch(resetSubmission(form.config.name));
        }).catch(function (result) {
          dispatch(failSubmission(form.config.name, result));
        });
      };
    },
    index: function index() {
      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var formId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      return function (dispatch, getState) {
        dispatch(requestSubmissions(form.config.name, page, formId));
        var submissions = form.selectors.getSubmissions(getState());

        if (parseInt(submissions.limit) !== 10) {
          params.limit = submissions.limit;
        }
        if (page !== 0) {
          params.skip = parseInt(page) * parseInt(submissions.limit);
          params.limit = parseInt(submissions.limit);
        } else {
          delete params.skip;
        }
        var formio = new _formiojs2.default(form.config.projectUrl + '/' + form.config.form + '/submission');

        return formio.loadSubmissions({ params: params }).then(function (result) {
          dispatch(receiveSubmissions(form.config.name, result));
        }).catch(function (result) {
          dispatch(failSubmissions(form.config.name, result));
        });
      };
    }
  };
}