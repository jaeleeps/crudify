
import { CrudifyClient } from '../src/CrudifyClient';
import { Bucket } from '../src/Bucket/Bucket';
import { testFirebaseConfig } from './env/tesFirebaseConfig';
import firebase from 'firebase';
import initializeApp = firebase.initializeApp;
test("Singleton Test", () => {
  const instance_a = CrudifyClient.getInstance();
  const instance_b = CrudifyClient.getInstance();
  expect(instance_a).toBe(instance_b);
})

test("Different Bucket Test", () => {
  const CRUD: CrudifyClient = CrudifyClient.getInstance();
  const defaultBucket: Bucket = CRUD.getDefaultBucket();
  const bucketA: Bucket = CRUD.addBucket("bucket_a");
  const bucketB: Bucket = CRUD.addBucket("bucket_b");

  expect(defaultBucket).not.toBe(bucketA);
  expect(defaultBucket).not.toBe(bucketB);
  expect(bucketA).not.toBe(bucketB);
})

test("Firebase Initialization Test", () => {
// Your web app's Firebase configuration
  const firebaseConfig = testFirebaseConfig;
// Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log(app);
})
