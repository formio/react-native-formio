import React from 'react';
import renderer from 'react-test-renderer';
import Columns from '../columns/Columns';
import colors from '../../../defaultTheme/colors';
import theme from '../../../defaultTheme';

import components from '../../../../test/forms/componentSpec';

describe('Columns', () => {
  describe.only(' Columns component', () => {
    var component= {
      'lockKey': true,
      'key': 'columns',
      'conditional': {
        'eq': '',
        'when': null,
        'show': ''
      },
      'type': 'columns',
      'columns': [
        {
          'components': [
            components.textfeild,
            components.password
          ]
        },
        {
          'components': [
            components.phoneNumber
          ]
        }
      ],
      'input': false
    };
    const attachToForm = jest.fn();

    it.only('Renders a basic columns component', () => {
      const element = renderer.create(<Columns
        component={component}
        attachToForm={attachToForm}
        colors={colors}
        theme={theme}
      />);

      expect(element).toMatchSnapshot();
      // expect(element.find('.row').length).to.equal(1);
      // expect(element.nodes[0].props.children[1].props.className).to.equal('col-sm-6');
    });

    it('Check number of columns ', function(done) {
      const element = renderer.create(<Columns
        component={component}
        attachToForm={attachToForm}
      />);

      expect(element.nodes[0].props.children[1].props.children.props.component.columns.length).to.equal(component.columns.length);
      done();
    });

    it('Check the nested components of columns', function(done) {
      const element = renderer.create(<Columns
        component={component}
        attachToForm={attachToForm}
      />);

      //To test type of nested components of columns
      for (var i= 0; i<component.columns.length; i++) {
        for (var j=0; j<component.columns[i].components.length; j++) {
          expect(element.nodes[0].props.children[1].props.children.props.component.columns[i].components[j].type).to.equal(component.columns[i].components[j].type);
        }
      }

      done();
    });
  });
});
