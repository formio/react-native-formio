'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _reducers = require('./reducers');

var reducers = _interopRequireWildcard(_reducers);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _selectors = require('./selectors');

var _selectors2 = _interopRequireDefault(_selectors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function _class(config) {
  var _this = this;

  _classCallCheck(this, _class);

  this.constants = constants;
  this.actions = actions;
  this.reducers = reducers;

  var defaultConfig = {
    storeKey: 'auth',
    path: 'auth',
    rootSelector: function rootSelector(state) {
      return state;
    },
    anonState: 'auth/login',
    authState: '',
    login: {
      form: 'user/login'
    },
    register: {
      form: 'user/register'
    }
  };
  this.config = Object.assign(defaultConfig, config);

  this.selectors = (0, _selectors2.default)(this.config);
  this.getRoutes = function (allRoutes, anonRoutes, authRoutes) {
    return (0, _routes2.default)(_this.config, allRoutes, anonRoutes, authRoutes);
  };
};

exports.default = _class;