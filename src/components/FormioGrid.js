import React from 'react';
import {View, Button, Text} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PropTypes from 'prop-types';
import Formiojs from '../formio';
import FormioUtils from '../formio/utils';
import {nested} from '../util';
import {FormioComponents} from '../factories';

export default class FormioGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.columnsFromForm(props.form),
      submissions: this.props.submissions || [],
      pagination: {...FormioGrid.defaultProps.pagination, ...this.props.pagination}
    };
  }

  formatCell(value, {column}) {
    return FormioComponents.getComponent(column.component.type).prototype.getDisplay(column.component, value);
  }

  columnsFromForm(form) {
    let columns = [];
    let buttons = this.props.buttons.map((button) => {
      return {
        property: '_id',
        header: {
          label: button.label
        },
        cell: {
          format: ({rowData}) => {
            return (
              <Button onPress={(event) => {
                this.onButtonClick(event, button.event, rowData);
              }}>
                {button.icon && <Icon name={button.icon}></Icon>}
                <Text>{button.label}</Text>
              </Button>
            );
          }
        },
        visible: true
      };
    });
    if (form && form.components) {
      FormioUtils.eachComponent(form.components, (component, path) => {
        if (component.input && component.tableView && component.key && path.indexOf('.') === -1) {
          columns.push({
            component: component,
            property: 'data.' + component.key,
            header: {
              label: component.label || component.key
            },
            cell: {
              format: this.formatCell
            },
            visible: true
          });
        }
      });
    }
    if (!buttons.length) {
      return columns;
    }
    if (this.props.buttonLocation === 'right') {
      return columns.concat(buttons);
    }
    else {
      return buttons.concat(columns);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.form !== this.props.form) {
      this.setState({
        columns: this.columnsFromForm(nextProps.form)
      });
    }
    if (nextProps.submissions !== this.state.submissions) {
      this.setState({
        submissions: nextProps.submissions
      });
    }
    if (nextProps.pagination.page !== this.state.pagination.page) {
      this.setState(curState => curState.pagination.page = nextProps.pagination.page);
    }
    if (nextProps.pagination.numPage !== this.state.pagination.numPage) {
      this.setState(curState => curState.pagination.numPage = nextProps.pagination.numPage);
    }
    if (nextProps.pagination.size !== this.state.pagination.size) {
      this.setState(curState => curState.pagination.size = nextProps.pagination.size);
    }
  }

  componentDidMount() {
    if (this.props.src) {
      this.formio = new Formiojs(this.props.src);
      this.loadForm();
      this.loadSubmissions();
    }
  }

  loadForm() {
    this.formio.loadForm().then(form => {
      this.setState({
        columns: this.columnsFromForm(form)
      });
    });
  }

  loadSubmissions() {
    this.formio.loadSubmissions({
      params: {
        ...this.props.query,
        limit: this.state.pagination.size,
        skip: (this.state.pagination.page - 1) * this.state.pagination.size
      }
    }).then(submissions => {
      this.setState(curState => {
        curState.submissions = submissions;
        curState.pagination.numPage = Math.ceil(submissions.serverCount / this.state.pagination.size);
        return curState;
      });
    });
  }

  onButtonClick(event, type, row) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof this.props.onButtonClick === 'function') {
      this.props.onButtonClick(type, row._id);
    }
  }

  onRowClick(row) {
    return {
      onClick: () => {
        if (typeof this.props.onButtonClick === 'function') {
          this.props.onButtonClick('row', row._id);
        }
      }
    };
  }

  onPageChange(page) {
    if (typeof this.props.onPageChange === 'function') {
      this.props.onPageChange(page);
    }
    else {
      this.setState(curState => curState.pagination.page = page, this.loadSubmissions);
    }
  }

  render() {
    let rows =  this.state.columns;
    return (
      <View>
        {rows}
      </View>
    );
  }
}

FormioGrid.defaultProps = {
  form: {},
  submissions: [],
  query: {
    sort: '-created'
  },
  pagination: {
    page: 1,
    numPage: 1,
    sizes: [25, 50, 75],
    size: 25
  },
  buttons: [],
  buttonLocation: 'right'
};

FormioGrid.propTypes = {
  src: PropTypes.string,
  form: PropTypes.object,
  submissions: PropTypes.object,
  buttons: PropTypes.array,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    numPage: PropTypes.number,
    sizes: PropTypes.arrayOf(PropTypes.number),
    size: PropTypes.number
  }),
  query: PropTypes.shape({
    sort: PropTypes.string
  }),
  buttonLocation: PropTypes.string,
  onButtonClick: PropTypes.func,
  onPageChange: PropTypes.func,
};
