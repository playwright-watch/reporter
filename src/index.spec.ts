import { expect, test } from '@jest/globals';
import { default as testable } from './index';

test('Example test', () => {
  expect(testable).not.toThrow();
});
