import React from 'react';
import renderer from 'react-test-renderer';
import Radio from '../radio/Radio';
import colors from '../../../defaultTheme/colors';
import theme from '../../../defaultTheme';

describe.only('Radio', () => {
  describe.only('Radio field', () => {
    const component= {
      'input': true,
      'tableView': true,
      'inputType': 'radio',
      'label': '',
      'key': 'radio',
      'values': [
        {
          'value': 'test',
          'label': 'test'
        },
        {
          'value': 'test1',
          'label': 'test1'
        }
      ],
      'defaultValue': '',
      'protected': false,
      'persistent': true,
      'validate': {
        'required': false,
        'custom': '',
        'customPrivate': false
      },
      'type': 'radio',
      'conditional': {
        'show': '',
        'when': null,
        'eq': ''
      },
      'inline': false
    };
    const attachToForm = jest.fn();

    it.only('Renders a radio field', () => {
      const element = renderer.create(
        <Radio
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />);

      expect(element).toMatchSnapshot();
    });

    it('Check the label value for each radio component', (done) => {
      const element = renderer.create(
        <Radio
      component={component}
      attachToForm={attachToForm}
        ></Radio>
      ).find('.radio-wrapper');
      expect(element.length).to.equal(1);

      //To test the label of each select boxes
      for (let i= 0; i<component.values.length; i++) {
        expect(element.find('.radio label input')[i].next.data).to.equal(component.values[i].label);
      }

      done();
    });

    it('Check radio component with label', (done) => {
      component.label = 'test Label';
      const element = renderer.create(
        <Radio
      component={component}
      attachToForm={attachToForm}
        ></Radio>
      ).find('label').eq(0);
      expect(element.attr('class')).to.equal('control-label');
      expect(element.length).to.equal(1);
      done();
    });

    it('Check the validations with required', (done) => {
      component.validate.required = true;
      const element = renderer.create(
        <Radio
      component={component}
      attachToForm={attachToForm}
        ></Radio>
      ).find('.formio-component-single');
      expect(element.find('.formio-component-single label').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check the validations without required', (done) => {
      component.validate.required = false;
      const element = renderer.create(
        <Radio
      component={component}
      attachToForm={attachToForm}
        ></Radio>
      ).find('.formio-component-single');
      expect(element.find('.formio-component-single label').attr('class')).to.equal('control-label');
      done();
    });

    it('Sets the checked class when selected', (done) => {
      const element = renderer.create(
        <Radio
          component={component}
          attachToForm={attachToForm}
        ></Radio>
      );
      // There is a label in the header so indexes are off by 1.
      expect(element.find('label').at(1).hasClass('not-checked')).to.equal(true);
      element.find('input').at(0).simulate('change', {'target': {'id': element.find('input').at(0).prop('id')}});
      expect(element.find('label').at(1).hasClass('checked')).to.equal(true);
      done();
    });

    it('sets a custom class', (done) => {
      component.customClass = 'my-custom-class';
      const element = renderer.create(
        <Radio
          component={component}
          attachToForm={attachToForm}
        ></Radio>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

    //To Do :- Write a test case to validate the inline layout support.
  });
});
