
import { CrudifyClient } from '../src/CrudifyClient';
import { Bucket } from '../src/Bucket/Bucket';
import { testFirebaseConfig } from './env/tesFirebaseConfig';
import firebase from 'firebase';
import initializeApp = firebase.initializeApp;
import { MongoClient } from 'mongodb';
import { testMongoDBAtlasPassword } from './env/testMongoDBAtlasConfig';
import { BucketConfiguration } from '../src/Bucket/BucketConfiguration';
import { FirestoreBucketConfiguration } from '../src/Bucket/FirestoreBucketConfiguration';
import { IFirestoreConfiguration } from '../src/Bucket/FirestoreConfiguration.interface';
import { IMongoConfiguration } from '../src/Bucket/MongoConfiguration.interface';
import { MongoBucketConfiguration } from '../src/Bucket/MongoBucketConfiguration';
import { AppClient, AppDatabase } from '../src/type/database.enum';
import App = firebase.app.App;
import { database } from 'firebase-admin';
import Reference = database.Reference;

test("Firebase Bucket Initialization Test", async () => {
  const config: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
  const firebaseBucket: Bucket = new Bucket(firebaseBucketConfig);

  const db: AppDatabase = await firebaseBucket.initialize();
  expect(db).not.toBe(null);
})


test("MongoDB Atlas Bucket Initialization Test", async () => {
  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const config: IMongoConfiguration = { uri: connectionURI, database: "airbnb" };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(config);
  const mongoBucket: Bucket = new Bucket(mongoBucketConfig);

  const db: AppDatabase = await mongoBucket.initialize();
  console.log(db);
  expect(db).not.toBe(null);
})

test("Firestore/Mongo Bucket Initialization Test", async () => {
  const firestoreConfig: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(firestoreConfig);

  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const mongoConfig: IMongoConfiguration = { uri: connectionURI, database: "airbnb" };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(mongoConfig);

  const bucket: Bucket = new Bucket(firebaseBucketConfig);

  const firestoreDb: AppDatabase = await bucket.initialize();
  expect(firestoreDb).not.toBe(null);

  bucket.config = mongoBucketConfig;
  const mongoDb: AppDatabase = await bucket.initialize();
  expect(mongoDb).not.toBe(null);
})
