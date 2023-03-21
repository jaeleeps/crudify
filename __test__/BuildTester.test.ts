import { BuildTester } from '../index';

test('My Greeter_00', () => {
  expect(BuildTester('Carl')).toBe('Hello Carl');
});

test('My Greeter_01', () => {
  expect(BuildTester('Jaeyoung')).toBe('Hello Jaeyoung');
});
