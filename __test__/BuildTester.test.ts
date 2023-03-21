import { CrudifySingleton } from '../src/CrudifySingleton';
test("Singleton Test", () => {
  const instance_a = CrudifySingleton.getInstance();
  const instance_b = CrudifySingleton.getInstance();
  expect(instance_a).toBe(instance_b);
})
