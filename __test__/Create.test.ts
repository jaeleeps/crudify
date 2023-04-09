import { Bucket } from '../src/Bucket/Bucket';
import { testFirebaseConfig } from './env/tesFirebaseConfig';
import { BucketConfiguration } from '../src/Bucket/BucketConfiguration';
import { FirestoreBucketConfiguration } from '../src/Bucket/FirestoreBucketConfiguration';
import { IFirestoreConfiguration } from '../src/Bucket/FirestoreConfiguration.interface';
import { AppClient, AppDatabase } from '../src/type/database.enum';
import { app, firestore } from 'firebase-admin';
import { IUser } from './Test.interface';
import App = app.App;
import Firestore = firestore.Firestore;
import firebase from 'firebase';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import { testMongoDBAtlasPassword } from './env/testMongoDBAtlasConfig';
import { IMongoConfiguration } from '../src/Bucket/MongoConfiguration.interface';
import { MongoBucketConfiguration } from '../src/Bucket/MongoBucketConfiguration';
import { Db, MongoClient } from 'mongodb';
import { CollectionReference } from '@google-cloud/firestore';
import DocumentData = firestore.DocumentData;

test("Firebase_C/R", async () => {
  const config: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
  const bucket: Bucket = new Bucket(firebaseBucketConfig);

  const db: AppDatabase = await bucket.initialize();

  const newUser: IUser = {
    id: '123',
    name: 'John Doe',
    email: 'johndoe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const newUserRef = await (db.collection('users') as CollectionReference<DocumentData>)
    .doc(newUser.id)
    .set(newUser);

  // Read the user document from Firestore
  const userRef: DocumentSnapshot<IUser> = await db.collection('users').doc(newUser.id).get();
  const user: IUser = userRef.data() as IUser;

  console.log(user);
  expect(user.id).toBe(newUser.id);
  expect(user.name).toBe(newUser.name);
  expect(user.email).toBe(newUser.email);
})

test("Mongo_C/R", async () => {
  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const mongoConfig: IMongoConfiguration = { uri: connectionURI, database: "airbnb" };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(mongoConfig);

  const bucket: Bucket = new Bucket(mongoBucketConfig);

  const db: AppDatabase = await bucket.initialize();

  const newUser: IUser = {
    id: '123',
    name: 'John Doe',
    email: 'johndoe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const usersCollection = db.collection<IUser>('users');
  await usersCollection.insertOne(newUser);

  // Read the user document from MongoDB
  const user = await usersCollection.findOne({ id: newUser.id });

  console.log(user);

  console.log(user);
  expect(user.id).toBe(newUser.id);
  expect(user.name).toBe(newUser.name);
  expect(user.email).toBe(newUser.email);
})

test("Mongo_Collection_C/R", async () => {
  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const mongoConfig: IMongoConfiguration = { uri: connectionURI, database: "airbnb" };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(mongoConfig);

  const bucket: Bucket = new Bucket(mongoBucketConfig);

  const db: AppDatabase = await bucket.initialize();

  const newUser: IUser = {
    id: '123',
    name: 'John Doe',
    email: 'johndoe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const usersCollection = db.collection<IUser>('users');
  await usersCollection.insertOne(newUser);

  // Read the user document from MongoDB
  const user = await usersCollection.findOne({ id: newUser.id });

  console.log(user);

  console.log(user);
  expect(user.id).toBe(newUser.id);
  expect(user.name).toBe(newUser.name);
  expect(user.email).toBe(newUser.email);
})
