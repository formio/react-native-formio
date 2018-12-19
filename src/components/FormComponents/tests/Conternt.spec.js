import React from 'react';
import renderer from 'react-test-renderer';
import colors from '../../../defaultTheme/colors';
import Content from '../content/Content.js';

 describe('Content', () => {
  describe('Content field', () => {
    const component= {
      'input': false,
      'html': '<p>Test p tag and<strong>strong tag</strong></p>\n',
      'type': 'content',
      'conditional': {
        'show': '',
        'when': null,
        'eq': ''
      },
      'key': 'testContent',
      'lockKey': true
    };
    const attachToForm = jest.fn();
     it('Renders a content component', () => {
      const element = renderer.create(
        <Content
          component={component}
          colors={colors}
          attachToForm={attachToForm}
        />
      );
      expect(element).toMatchSnapshot();
    });

     it.skip('Check the html for content component', () => {
      const element = renderer.create(
        <Content
          component={component}
          colors={colors}
          attachToForm={attachToForm}
        />
      ).find('div');
      expect(element.html()).to.equal(component.html);
    });
   });
 });
