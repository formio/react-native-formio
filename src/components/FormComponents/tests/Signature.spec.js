import React from 'react';
import renderer from 'react-test-renderer';
import Signature from '../signature/Signature';

describe.skip('Signature', () => {
  describe('Signature field', () => {
    var component= {
      'input': true,
      'tableView': true,
      'label': 'Signature',
      'key': 'signature',
      'placeholder': '',
      'footer': 'Sign above',
      'width': '100%',
      'height': '150px',
      'penColor': 'black',
      'backgroundColor': 'rgb(245,245,235)',
      'minWidth': '0.5',
      'maxWidth': '2.5',
      'protected': false,
      'persistent': true,
      'validate': {
        'required': false
      },
      'type': 'signature',
      'hideLabel': true,
      'conditional': {
        'show': '',
        'when': null,
        'eq': ''
      }
    };
    var attachToForm = jest.fn();

    it('Renders a basic Signature field', (done) => {
      const element = renderer.create(
        <Signature
          component={component}
          attachToForm={attachToForm}
        ></Signature>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-signature form-group-signature')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-signature');
      expect(element.find('.form-group-signature .m-signature-pad').length).to.equal(1);
      expect(element.find('.form-group-signature .m-signature-pad .m-signature-pad--body').length).to.equal(1);
      expect(element.find('.form-group-signature .m-signature-pad .m-signature-pad--body canvas').length).to.equal(1);
      done();
    });

    it('Check Footer for signature component', (done) => {
      const element = renderer.create(
        <Signature
          component={component}
          attachToForm={attachToForm}
        ></Signature>
      ).find('.formio-signature-footer');
      expect(element).to.have.length(1);
      expect(element.html()).to.equal(component.footer);
      done();
    });

    //Checked the clear button class is glyphicon-refresh.
    it('Check refresh button of signature component', (done) => {
      const element = renderer.create(
        <Signature
          component={component}
          attachToForm={attachToForm}
        ></Signature>
      ).find('.glyphicon-refresh');
      expect(element).to.have.length(1);
      done();
    });

    it('Sets a custom class', (done) => {
      component.customClass = 'my-custom-class';
      const element = renderer.create(
        <Signature
          component={component}
          attachToForm={attachToForm}
        ></Signature>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });
  });
});
