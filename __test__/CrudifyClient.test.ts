
import { CrudifyClient } from '../src/CrudifyClient';
import { Bucket } from '../src/Bucket/Bucket';
import { testFirebaseConfig } from './env/tesFirebaseConfig';
import firebase from 'firebase';
import initializeApp = firebase.initializeApp;
import { MongoClient } from 'mongodb';
import { testMongoDBAtlasPassword } from './env/testMongoDBAtlasConfig';
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
  console.log(firebase.apps);
  console.log(app);
  expect(app).not.toBe(null);
})

test("MongoDB Atlas Initialization Test", async () => {
  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(connectionURI);
  await client.connect();

  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));

  expect(client).not.toBe(null);
  expect(databasesList).not.toBe(null);
})
