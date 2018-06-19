"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (authConfig) {
  var getRoot = function getRoot(state) {
    return authConfig.rootSelector(state);
  };
  var getAuth = function getAuth(state) {
    return getRoot(state)[authConfig.storeKey];
  };
  var getUser = function getUser(state) {
    return getAuth(state).user;
  };
  var getAuthenticated = function getAuthenticated(state) {
    return getAuth(state).authenticated;
  };

  return {
    getAuth: getAuth,
    getUser: getUser,
    getAuthenticated: getAuthenticated
  };
};