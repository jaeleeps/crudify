import { CrudifyClient } from '../src/CrudifyClient';

test("Singleton Test", () => {
  const instance_a = CrudifyClient.getInstance();
  const instance_b = CrudifyClient.getInstance();
  expect(instance_a).toBe(instance_b);
})
