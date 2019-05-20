import React from 'react';
import renderer from 'react-test-renderer';
import colors from '../../../defaultTheme/colors';
import theme from '../../../defaultTheme';
import Select from '../select/Select';

describe('Select Field', () => {
  describe('Select Component', () => {
    var component= {
      'input': true,
      'tableView': true,
      'label': '',
      'key': 'select',
      'placeholder': '',
      'data': {
        'values': [
          {
            'value': 'a',
            'label': 'a'
          },
          {
            'value': 'b',
            'label': 'b'
          },
          {
            'value': 'c',
            'label': 'c'
          },
          {
            'value': 'd',
            'label': 'd'
          }
        ],
        'json': '',
        'url': '',
        'resource': ''
      },
      'dataSrc': 'values',
      'valueProperty': '',
      'defaultValue': '',
      'refreshOn': '',
      'filter': '',
      'authenticate': false,
      'template': '<span>{{ item.label }}</span>',
      'multiple': false,
      'protected': true,
      'unique': false,
      'persistent': true,
      'validate': {
        'required': false
      },
      'type': 'select',
      'conditional': {
        'show': '',
        'when': null,
        'eq': ''
      }
    };
    var attachToForm = jest.fn();

    it.only('Render a basic select component', () => {
      const element = renderer.create(
        <Select
          component={component}
          colors={colors}
          theme={theme}
          attachToForm={attachToForm}
        />
      );
      expect(element).toMatchSnapshot();
    });

    it('Check the label of the select component', () => {
      component.label = 'Select component';
      const element = renderer.create(
        <Select
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(1);
    });

    it('Check with out label for select component', () => {
      component.label = null;
      const element = renderer.create(
        <Select
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(0);
    });

    it('Check the dropdown and check the number of options of select component', () => {
      const element = renderer.create(
        <Select
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-i-caret-down').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);

      //To check the number of options for select component

      expect(element.find('.rw-popup ul li').length).to.equal(component.data.values.length);
    });

    it('Render a multiple select component ', () => {
      component.multiple = true;
      const element = renderer.create(
        <Select
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element).to.have.length(1);
      component.multiple = false;
    });
  });
});
