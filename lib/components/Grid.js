'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('formiojs/utils');

var _utils2 = _interopRequireDefault(_utils);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Component) {
  _inherits(_class, _Component);

  function _class() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, _class);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _this.render = function () {
      var _this$props = _this.props,
          submissions = _this$props.submissions,
          columns = _this$props.columns,
          columnWidths = _this$props.columnWidths,
          sortOrder = _this$props.sortOrder,
          onSort = _this$props.onSort,
          _onClick = _this$props.onClick,
          Cell = _this$props.Cell;
      var _this$props2 = _this.props,
          firstItem = _this$props2.firstItem,
          lastItem = _this$props2.lastItem,
          total = _this$props2.total,
          activePage = _this$props2.activePage,
          onPage = _this$props2.onPage,
          pages = _this$props2.pages;

      return _react2.default.createElement(
        'div',
        null,
        submissions.length ? _react2.default.createElement(
          'ul',
          { className: 'list-group list-group-striped' },
          _react2.default.createElement(
            'li',
            { className: 'list-group-item list-group-header hidden-xs hidden-md' },
            _react2.default.createElement(
              'div',
              { className: 'row' },
              columns.map(function (column, index) {
                var sortClass = '';
                if (sortOrder === column.key) {
                  sortClass = 'glyphicon glyphicon-triangle-top';
                } else if (sortOrder === '-' + column.key) {
                  sortClass = 'glyphicon glyphicon-triangle-bottom';
                }
                return _react2.default.createElement(
                  'div',
                  { key: index, className: 'col col-md-' + columnWidths[index] },
                  _react2.default.createElement(
                    'a',
                    { onClick: function onClick() {
                        return onSort(column.key);
                      } },
                    _react2.default.createElement(
                      'strong',
                      null,
                      column.title,
                      ' ',
                      _react2.default.createElement('span', { className: sortClass })
                    )
                  )
                );
              })
            )
          ),
          submissions.map(function (submission, index) {
            return _react2.default.createElement(
              'li',
              { className: 'list-group-item', key: submission._id },
              _react2.default.createElement(
                'div',
                { className: 'row' },
                columns.map(function (column, index) {
                  return _react2.default.createElement(
                    'div',
                    { key: index, className: 'col col-md-' + columnWidths[index], onClick: function onClick() {
                        return _onClick(submission);
                      } },
                    _react2.default.createElement(
                      'h4',
                      { className: 'hidden-md hidden-lg' },
                      column.title
                    ),
                    _react2.default.createElement(Cell, { row: submission, column: column })
                  );
                })
              )
            );
          }),
          _react2.default.createElement(
            'li',
            { className: 'list-group-item' },
            _react2.default.createElement(_reactBootstrap.Pagination, {
              className: 'pagination-sm',
              prev: 'Previous',
              next: 'Next',
              items: pages,
              activePage: activePage,
              maxButtons: 5,
              onSelect: onPage
            }),
            _react2.default.createElement(
              'span',
              { className: 'pull-right item-counter' },
              _react2.default.createElement(
                'span',
                { className: 'page-num' },
                firstItem,
                ' - ',
                lastItem
              ),
              ' / ',
              total,
              ' total'
            )
          )
        ) : _react2.default.createElement(
          'div',
          null,
          'No data found'
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return _class;
}(_react.Component);

_class.propTypes = {
  submissions: _propTypes2.default.array.isRequired,
  columns: _propTypes2.default.array.isRequired,
  columnWidths: _propTypes2.default.object.isRequired,
  onSort: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onPage: _propTypes2.default.func,
  firstItem: _propTypes2.default.number,
  lastItem: _propTypes2.default.number,
  total: _propTypes2.default.number,
  pages: _propTypes2.default.number,
  activePage: _propTypes2.default.number,
  Cell: _propTypes2.default.func
};
_class.defaultProps = {
  onSort: function onSort() {},
  onClick: function onClick() {},
  onPage: function onPage() {},
  firstItem: 1,
  lastItem: 1,
  total: 1,
  pages: 1,
  activePage: 1,
  Cell: function Cell(props) {
    var row = props.row,
        column = props.column;

    return _react2.default.createElement(
      'span',
      null,
      (0, _get3.default)(row, column.key, '')
    );
  }
};
exports.default = _class;