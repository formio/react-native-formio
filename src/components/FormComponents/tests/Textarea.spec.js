import React from 'react';
import renderer from 'react-test-renderer';
import colors from '../../../defaultTheme/colors';
import theme from '../../../defaultTheme';
import Textarea from '../textarea/Textarea';

 describe('Textarea', () => {
  describe('Single Textarea', () => {
    const component= {
      'input': true,
      'tableView': true,
      'label': 'textarea',
      'key': 'textarea',
      'placeholder': '',
      'prefix': '',
      'suffix': '',
      'rows': 3,
      'multiple': false,
      'defaultValue': '',
      'protected': false,
      'persistent': true,
      'wysiwyg': false,
      'validate': {
        'required': false,
        'minLength': '',
        'maxLength': '',
        'pattern': '',
        'custom': ''
      },
      'type': 'textarea',
      'conditional': {
        'show': '',
        'when': null,
        'eq': ''
      }
    };
    const attachToForm = jest.fn();
     it('Renders a basic textarea', () => {
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      );
      expect(element).toMatchSnapshot();
    });

     it.skip('Fills in the placeholder value', () => {
      component.placeholder = 'My Placeholder';
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('textarea');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
    });
     it.skip('Renders with a prefix', () => {
      component.prefix = '$';
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('$');
      component.prefix = '';
    });
     it.skip('Renders with a suffix', () => {
      component.suffix = 'Pounds';
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(1).html()).to.equal('Pounds');
      component.suffix = '';
    });
     it.skip('Renders with prefix and suffix', () => {
      component.prefix = 'Prefix';
      component.suffix = 'Suffix';
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('.input-group');
      expect(element.children().length).to.equal(3);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('Prefix');
      expect(element.children().eq(2).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(2).html()).to.equal('Suffix');
      component.prefix = '';
      component.suffix = '';
    });
     it.skip('Check single textarea with required', () => {
      component.validate.required = true;
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label field-required');
    });
     it.skip('Check single textarea without required', () => {
      component.validate.required = false;
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label');
    });
     it.skip('Check single textarea without label', () => {
      component.label = '';
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      );
      expect(element.find('.formio-component-single label').length).to.equal(0);
    });
     it.skip('sets a custom class', () => {
      component.customClass = 'my-custom-class';
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
    });
   });
   describe('Multiple Textarea', () => {
    const component = {
      'input': true,
      'tableView': true,
      'label': 'textarea',
      'key': 'textarea',
      'placeholder': '',
      'prefix': '',
      'suffix': '',
      'rows': 3,
      'multiple': true,
      'defaultValue': '',
      'protected': false,
      'persistent': true,
      'wysiwyg': false,
      'validate': {
        'required': false,
        'minLength': '',
        'maxLength': '',
        'pattern': '',
        'custom': ''
      },
      'type': 'textarea',
      'conditional': {
        'show': '',
        'when': null,
        'eq': ''
      }
    };
    const attachToForm = jest.fn();
     it.skip('Renders a multi-value textarea', () => {
      const element = renderer.create(
        <Textarea
          name='textarea'
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('.form-field-type-textarea');
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-textarea form-group-textarea')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-textarea');
      expect(element.children().eq(0).hasClass('formio-component-multiple')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).attr('for')).to.equal('textarea');
      expect(element.children().eq(0).children().eq(0).hasClass('control-label')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).text()).to.equal('textarea');
      const table = element.children().eq(0).children().eq(1);
      expect(table.hasClass('table table-bordered')).to.equal(true);
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr td div.input-group').length).to.equal(1);
      expect(table.find('tr td div.input-group textarea').attr('placeholder')).to.equal('');
      //expect(table.find('tr td div.input-group textarea').attr('value')).to.equal('');
      expect(table.find('tr td div.input-group textarea').attr('id')).to.equal('textarea');
      expect(table.find('tr td div.input-group textarea').attr('name')).to.equal('textarea');
      expect(table.find('tr td div.input-group textarea').attr('class')).to.equal('form-control');
      expect(table.find('tr td div.input-group textarea').attr('data-index')).to.equal('0');
    });
     it.skip('Fills in the placeholder value', () => {
      component.placeholder = 'My Placeholder';
      const element = renderer.create(
        <Textarea
          name='textarea'
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('textarea#textarea');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
    });
     it.skip('Renders with a prefix', () => {
      component.prefix = '$';
      const element = renderer.create(
        <Textarea
          name='textarea'
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('$');
      component.prefix = '';
    });
     it.skip('Renders with a suffix', () => {
      component.suffix = 'Pounds';
      const element = renderer.create(
        <Textarea
          name='textarea'
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(1).html()).to.equal('Pounds');
      component.suffix = '';
    });
     it.skip('Renders with prefix and suffix', () => {
      component.prefix = 'Prefix';
      component.suffix = 'Suffix';
      const element = renderer.create(
        <Textarea
          name='textarea'
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('.input-group');
      expect(element.children().length).to.equal(3);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('Prefix');
      expect(element.children().eq(2).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(2).html()).to.equal('Suffix');
      component.prefix = '';
      component.suffix = '';
    });
     it.skip('Adds and removes rows', () => {
      component.defaultValue = 'My Value';
      const element = renderer.create(
        <Textarea
          name='textarea'
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).find('.form-field-type-textarea');
      const table = element.find('table');
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(3);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(4);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      expect(table.find('tr').at(2).find('textarea').prop('data-index')).to.equal(2);
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(5);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      expect(table.find('tr').at(2).find('textarea').prop('data-index')).to.equal(2);
      expect(table.find('tr').at(3).find('textarea').prop('data-index')).to.equal(3);
      table.find('a.btn.remove-row-3').simulate('click');
      expect(table.find('tr').length).to.equal(4);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      expect(table.find('tr').at(2).find('textarea').prop('data-index')).to.equal(2);
      table.find('a.btn.remove-row-1').simulate('click');
      expect(table.find('tr').length).to.equal(3);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      table.find('a.btn.remove-row-1').simulate('click');
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      table.find('a.btn.remove-row-0').simulate('click');
      expect(table.find('tr').length).to.equal(1);
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
    });
     it.skip('Check multiple textarea with required', () => {
      component.validate.required = true;
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label field-required');
    });
     it.skip('Check multiple textarea without required', () => {
      component.validate.required = false;
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label');
    });
     it.skip('Check multiple textarea without label', () => {
      component.label = '';
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      );
      expect(element.find('.formio-component-multiple label').length).to.equal(0);
    });
     it.skip('sets a custom class', () => {
      component.customClass = 'my-custom-class';
      const element = renderer.create(
        <Textarea
          component={component}
          attachToForm={attachToForm}
          colors={colors}
          theme={theme}
        />
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
    });
  });
});
