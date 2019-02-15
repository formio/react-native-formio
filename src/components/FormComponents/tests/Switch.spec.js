import React from 'react';
import renderer from 'react-test-renderer';
import colors from '../../../defaultTheme/colors';
import Switch from '../switch/Switch';

describe('Switch', () => {
  describe('Switch field', () => {
    const component= {
      'conditional': {
        'eq': '',
        'when': null,
        'show': ''
      },
      'type': 'checkbox',
      'validate': {
        'required': false
      },
      'persistent': true,
      'protected': false,
      'defaultValue': false,
      'key': 'checkbox',
      'label': 'Checkbox',
      'hideLabel': true,
      'tableView': true,
      'inputType': 'checkbox',
      'input': true
    };
    var attachToForm = jest.fn();
    it.only('Renders a checkbox field', () => {
      const element = renderer.create(
        <Switch
          colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element).toMatchSnapshot();
    });

    it('Renders a checkbox field without a label', () => {
      component.hideLabel = true;
      component.datagridLabel = false;
      const element = renderer.create(
        <Switch
          colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.find('.checkbox label').html()).to.equal('<input type="checkbox" id="checkbox">');
      delete component.datagridLabel;
    });

    it('Renders a checkbox field with a label when variables set', () => {
      component.hideLabel = false;
      component.datagridLabel = false;
      const element = renderer.create(
        <Switch
          colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.find('.checkbox label').html()).to.equal('<input type="checkbox" id="checkbox">Checkbox');
      delete component.datagridLabel;
      component.hideLabel = true;
    });

    it('Renders a checkbox field with a label when variables set', () => {
      component.hideLabel = true;
      component.datagridLabel = true;
      const element = renderer.create(
        <Switch
          colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.find('.checkbox label').html()).to.equal('<input type="checkbox" id="checkbox">Checkbox');
      delete component.datagridLabel;
      component.hideLabel = true;
    });

    it('Renders a checkbox field with a label when variables set', () => {
      component.hideLabel = false;
      component.datagridLabel = true;
      const element = renderer.create(
        <Switch
          colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.find('.checkbox label').html()).to.equal('<input type="checkbox" id="checkbox">Checkbox');
      delete component.datagridLabel;
      component.hideLabel = true;
    });

    it('Sets a default value as true', () => {
      component.defaultValue = true;
      const element = renderer.create(
        <Switch
          colors={colors}
          component={component}
          value={component.defaultValue}
          attachToForm={attachToForm}
        />
      );
      expect(element.attr('checked')).to.equal('checked');
      component.defaultValue = false;
    });

    it('Check the validations', () => {
      component.validate.required = true;
      const element = renderer.create(
        <Switch
          colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.find('.checkbox label').attr('class')).to.equal('control-label field-required not-checked');
    });

    it('Sets the checked class when selected', () => {
      const element = renderer.create(
        <Switch
          colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.find('label').hasClass('not-checked')).to.equal(true);
      element.find('input').simulate('change', {'target': {'checked': true}});
      expect(element.find('label').hasClass('checked')).to.equal(true);
    });

    it('sets a custom class', () => {
      component.customClass = 'my-custom-class';
      const element = renderer.create(
        <Switch
          colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
    });
  });
});
