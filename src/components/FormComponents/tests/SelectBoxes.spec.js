import React from 'react';
import renderer from 'react-test-renderer';
import colors from '../../../defaultTheme/colors';
import Selectboxes from '../selectboxes/SelectBoxes';

describe('Selectboxes', () => {
  describe('Selectboxes field', () => {
    const component= {
      'conditional': {
        'eq': '',
        'when': null,
        'show': ''
      },
      'type': 'selectboxes',
      'validate': {
        'required': false
      },
      'persistent': true,
      'protected': false,
      'inline': false,
      'values': [
        {
          'label': 'firstSelectbox',
          'value': 'firstSelectbox-value'
        },
        {
          'label': 'secondSelectbox',
          'value': 'secondSelectbox-value'
        },
        {
          'label': 'thirdSelectbox',
          'value': 'thirdSelectbox-value'
        }
      ],
      'key': 'selectBox',
      'label': 'selectBox',
      'tableView': true,
      'input': true
    };
    const attachToForm = jest.fn();

    it.only('Renders a selectboxes field', () => {
      const element = renderer.create(
        <Selectboxes
          colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element).toMatchSnapshot();
    });

    it('Check the label value for each selectbox component', () => {
      const element = renderer.create(
        <Selectboxes
           colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.find('.checkbox').length).to.equal(component.values.length);
      expect(element.find('.checkbox label input').attr('type')).to.equal('checkbox');

      //To test the label of each select boxes
      for (let i= 0; i<component.values.length; i++) {
        expect(element.find('.checkbox label input ')[i].next.data).to.equal(component.values[i].label);
      }
    });

    it('Check the validations with required', () => {
      component.validate.required = true;
      const element = renderer.create(
        <Selectboxes
           colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.attr('class')).to.equal('control-label field-required');
    });

    it('Check the validations with out required', () => {
      component.validate.required = false;
      const element = renderer.create(
        <Selectboxes
           colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.attr('class')).to.equal('control-label');
    });

    it('Check single Selectboxes with label', () => {
      component.label = 'test Label';
      const element = renderer.create(
        <Selectboxes
           colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.attr('class')).to.equal('control-label');
      expect(element.length).to.equal(1);
    });

    it('Sets the checked class when selected', () => {
      const element = renderer.create(
        <Selectboxes
           colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      // There is a label in the header so indexes are off by 1.
      expect(element.find('label').at(1).hasClass('not-checked')).to.equal(true);
      element.find('input').at(0).simulate('change', {'target': {'checked': true}});
      expect(element.find('label').at(1).hasClass('checked')).to.equal(true);
    });

    it('sets a custom class', () => {
      component.customClass = 'my-custom-class';
      const element = renderer.create(
        <Selectboxes
           colors={colors}
          component={component}
          attachToForm={attachToForm}
        />
      );
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
    });
  });
});
