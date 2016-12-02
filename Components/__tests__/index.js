'use strict';

import React from 'react';
import renderer from 'react-test-renderer';

import App from '../';

test('<App> renders without user prop', () => {
  const tree = renderer.create(
    <App>test</App>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('<App> renders with user prop', () => {
  const tree = renderer.create(
    <App user={{id: '123', username: 'L42y'}}>test</App>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
