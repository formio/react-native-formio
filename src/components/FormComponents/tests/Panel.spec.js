import React from 'react';
import renderer from 'react-test-renderer';
import Panel from '../panel/Panel';
import colors from '../../../defaultTheme/colors';
import theme from '../../../defaultTheme';

import components from '../../../../test/forms/componentSpec';

describe('Panel', () => {
  describe(' Panel component', () => {
    var component= {
      'input': false,
      'title': 'testpanel',
      'theme': 'warning',
      'components': [
        components.textfeild,
        components.password,
        components.phoneNumber
      ],
      'type': 'panel',
      'conditional': {
        'show': '',
        'when': null,
        'eq': ''
      }
    };
    const attachToForm = jest.fn();

    it.only('Renders a basic panel component', () => {
      const element = renderer.create(<Panel
        component={component}
        attachToForm={attachToForm}
        colors={colors}
        theme={theme}
      />);

      expect(element).toMatchSnapshot();
      // expect(element.find('.panel').length).to.equal(1);
    });

    it('Test the theme of panel component', function(done) {
      const element = renderer.create(<Panel
        component={component}
        attachToForm={attachToForm}
        />).find('.panel');
      expect(element.nodes[0].props.className).to.equal('panel panel-' + component.theme + ' ');
      done();
    });

    it('Test the label of panel component', function(done) {
      const element = renderer.create(<Panel
        component={component}
        attachToForm={attachToForm}
        />).find('.panel');
      expect(element.nodes[0].props.children[0].props.className).to.equal('panel-heading');
      expect(element.nodes[0].props.children[0].props.children.props.className).to.equal('panel-title');
      done();
    });

    it('Check the nested components of Panel', function(done) {
      const element = renderer.create(<Panel
        component={component}
        attachToForm={attachToForm}
        />).find('.panel-body');

      //To test type of nested components of panel
      for (var i= 0; i<component.components.length; i++) {
        expect(element.nodes[0].props.children.props.component.components[i].type).to.equal(component.components[i].type);
      }
      done();
    });
  });
});
