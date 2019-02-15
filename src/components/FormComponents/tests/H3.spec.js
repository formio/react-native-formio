import React from 'react';
import renderer from 'react-test-renderer';
import H3 from '../h3/H3';

describe('H#', () => {
  describe(' H3 component', () => {
    it('Renders a basic H3 component', () => {
      const element = renderer.create(<H3>Header</H3>);

      expect(element).toMatchSnapshot();
    });
  });
});
