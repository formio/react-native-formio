import React from 'react';
import SelectComponent from '../sharedComponents/Select';
import formiojs from '../../../formio';
import {Text} from 'react-native';
import {interpolate, serialize, raw} from '../../../util';
import get from 'lodash/get';

export default class Select extends SelectComponent {
  constructor(props) {
    super(props);
    this.getValueField = this.getValueField.bind(this);
    this.refreshItems = this.refreshItems.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.setResult = this.setResult.bind(this);
    this.getValueDisplay = this.getValueDisplay.bind(this);
  }

  componentDidMount() {
    switch (this.props.component.dataSrc) {
      case 'values':
        this.internalFilter = true;
        this.setState({
          selectItems: this.props.component.data.values
        });
        break;
      case 'json':
        try {
          if (typeof this.props.component.data.json === 'string') {
            this.items = JSON.parse(this.props.component.data.json);
          }
          else if (typeof this.props.component.data.json === 'object') {
            this.items = this.props.component.data.json;
          }
          else {
            this.items = [];
          }
        }
        catch (error) {
          this.items = [];
        }
        this.options.params = {
          limit: parseInt(this.props.component.limit) || 20,
          skip: 0
        };
        this.refreshItems = (input, url, append) => {
          // If they typed in a search, reset skip.
          if ((this.lastInput || input) && this.lastInput !== input) {
            this.lastInput = input;
            this.options.params.skip = 0;
          }
          let items = this.items;
          if (input) {
            items = items.filter(item => {
              // Get the visible string from the interpolated item.
              const value = interpolate(this.props.component.template, {item}).replace(/<(?:.|\n)*?>/gm, '');
              switch (this.props.component.filter) {
                case 'startsWith':
                  return value.toLowerCase().lastIndexOf(input.toLowerCase(), 0) === 0;
                case 'contains':
                default:
                  return value.toLowerCase().indexOf(input.toLowerCase()) !== -1;
              }
            });
          }
          items = items.slice(this.options.params.skip, this.options.params.skip + this.options.params.limit);
          this.setResult(items, append);
        };
        this.refreshItems();
        break;
      case 'custom':
        this.refreshItems = () => {
          try {
            /* eslint-disable no-unused-vars */
            const {data, row} = this.props;
            /* eslint-enable no-unused-vars */
            let selectItems = eval('(function(data, row) { var values = [];' + this.props.component.data.custom.toString() + '; return values; })(data, row)');
            if (!Array.isArray(selectItems)) {
              throw 'Didn\'t return an array.';
            }
            this.setState({
              selectItems
            });
          }
          catch (error) {
            this.setState({
              selectItems: []
            });
          }
        };
        this.refreshItems();
        break;
      case 'resource':
      case 'url':
        if (this.props.component.dataSrc === 'url') {
          this.url = this.props.component.data.url;
          if (this.url.substr(0, 1) === '/') {
            this.url = formiojs.getBaseUrl() + this.props.component.data.url;
          }

          // Disable auth for outgoing requests.
          if (!this.props.component.authenticate && this.url.indexOf(formiojs.getBaseUrl()) === -1) {
            this.options = {
              disableJWT: true,
              headers: {
                Authorization: undefined,
                Pragma: undefined,
                'Cache-Control': undefined
              }
            };
          }
        }
        else {
          this.url = formiojs.getBaseUrl();
          if (this.props.component.data.project) {
            this.url += '/project/' + this.props.component.data.project;
          }
          this.url += '/form/'  + this.props.component.data.resource + '/submission';
        }

        this.options.params = {
          limit: this.props.component.limit || 100,
          skip: 0
        };

        this.refreshItems = (input, newUrl, append) => {
          let {data, row} = this.props;
          newUrl = newUrl || this.url;
          // Allow templating the url.
          newUrl = interpolate(newUrl, {
            data,
            row,
            formioBase: formiojs.getBaseUrl()
          });
          if (!newUrl) {
            return;
          }

          // If this is a search, then add that to the filter.
          if (this.props.component.searchField && input) {
            // If they typed in a search, reset skip.
            if (this.lastInput !== input) {
              this.lastInput = input;
              this.options.params.skip = 0;
            }
            newUrl += ((newUrl.indexOf('?') === -1) ? '?' : '&') +
              encodeURIComponent(this.props.component.searchField) +
              '=' +
              encodeURIComponent(input);
          }

          // Add the other filter.
          if (this.props.component.filter) {
            const filter = interpolate(this.props.component.filter, {data});
            newUrl += ((newUrl.indexOf('?') === -1) ? '?' : '&') + filter;
          }

          // If they wish to return only some fields.
          if (this.props.component.selectFields) {
            this.options.params.select = this.props.component.selectFields;
          }

          // If this is a search, then add that to the filter.
          newUrl += ((newUrl.indexOf('?') === -1) ? '?' : '&') + serialize(this.options.params);
          formiojs.request(newUrl).then(data => {
            // If the selectValue prop is defined, use it.
            if (this.props.component.selectValues) {
              this.setResult(get(data, this.props.component.selectValues, []), append);
            }
            // Attempt to default to the formio settings for a resource.
            else if (data.hasOwnProperty('data')) {
              this.setResult(data.data, append);
            }
            else if (data.hasOwnProperty('items')) {
              this.setResult(data.items, append);
            }
            // Use the data itself.
            else {
              this.setResult(data, append);
            }
          });
        };

        this.refreshItems();

        break;
      default:
        this.setState({
          selectItems: []
        });
    }
  }

  getValueField() {
    if (this.props.component.dataSrc === 'custom' || this.props.component.dataSrc === 'json') {
      return false;
    }
    if (this.props.component.dataSrc === 'resource' && this.props.component.valueProperty === '') {
      return '_id';
    }
    return this.props.component.valueProperty || 'value';
  }

  refreshItems() {}

  loadMoreItems(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.onEvent('loadMore', this.loadMoreItems);
    this.options.params.skip += this.options.params.limit;
    this.refreshItems(null, null, true);
  }

  setResult(data, append) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    if (append) {
      this.setState({
        selectItems: [...this.state.selectItems, ...data],
        hasNextPage: this.state.selectItems.length >= (this.options.params.limit + this.options.params.skip),
      });
    }
 else {
      this.setState({
        selectItems: data,
        hasNextPage: this.state.selectItems.length >= (this.options.params.limit + this.options.params.skip),
      });
    }
  }

  getValueDisplay(component, data) {
    const getItem = (data) => {
      switch (component.dataSrc) {
        case 'values':
          component.data.values.forEach((item) => {
            if (item.value === data) {
              data = item;
            }
          });
          return data;
        case 'json':
          if (component.valueProperty) {
            let selectItems;
            try {
              selectItems = JSON.parse(component.data.json);
            }
            catch (error) {
              selectItems = [];
            }
            selectItems.forEach((item) => {
              if (item[component.valueProperty] === data) {
                data = item;
              }
            });
          }
          return data;
        // TODO: implement url and resource view.
        case 'url':
        case 'resource':
        default:
          return data;
      }
    };
    if (component.multiple && Array.isArray(data)) {
      return data.map(getItem).reduce(function(prev, item) {
        var value;
        if (typeof item === 'object') {
          value = (<Text>{raw(interpolate(component.template, {item}))}</Text>);
        }
        else {
          value = item;
        }
        return (prev === '' ? '' : ', ') + value;
      }, '');
    }
    else {
      var item = getItem(data);
      var value;
      if (typeof item === 'object') {
        value = (<Text>{raw(interpolate(component.template, {item}))}</Text>);
      }
      else {
        value = item;
      }
      return value;
    }
  }
}
