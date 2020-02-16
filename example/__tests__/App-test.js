/**
 * @format
 */

import 'react-native';
import React from 'react';
import Cards from '../app/cards';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<Cards />);
});
