
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
import { AppClient } from '../src/type/database.enum';
test("Firebase Bucket Initialization Test", async () => {
  const config: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
  const firebaseBucket: Bucket = new Bucket(firebaseBucketConfig);

  const appClient: AppClient = await firebaseBucket.initialize();
  console.log(appClient);
  expect(appClient).not.toBe(null);
})


test("MongoDB Atlas Bucket Initialization Test", async () => {
  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const config: IMongoConfiguration = { uri: connectionURI };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(config);
  const mongoBucket: Bucket = new Bucket(mongoBucketConfig);

  const appClient: AppClient = await mongoBucket.initialize();
  console.log(appClient);
  expect(appClient).not.toBe(null);
})

test("Firestore/Mongo Bucket Initialization Test", async () => {
  const firestoreConfig: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(firestoreConfig);

  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const mongoConfig: IMongoConfiguration = { uri: connectionURI };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(mongoConfig);

  const bucket: Bucket = new Bucket(firebaseBucketConfig);

  const firestoreAppClient: AppClient = await bucket.initialize();
  expect(firestoreAppClient).not.toBe(null);

  bucket.config = mongoBucketConfig;
  const mongoAppClient: AppClient = await bucket.initialize();
  expect(mongoAppClient).not.toBe(null);
})

test("[Mongo][Update] Test", async () => {
  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const config: IMongoConfiguration = { uri: connectionURI };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(config);
  const mongoBucket: Bucket = new Bucket(mongoBucketConfig);

  const appClient: AppClient = await mongoBucket.initialize();
  // const databasesList = await (appClient as MongoClient).db().admin().listDatabases();
  // console.log("Databases:");
  // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  const dbo = (appClient as MongoClient).db("airbnb");

  const currentdate = new Date();
  const datetime: string = "Last Sync: " + currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();

  const myobj = { "test_timestamp": datetime}
  dbo.collection("Listings").insertOne(myobj, (err, res) => {
    if (err) throw err;
    console.log("1 document inserted");
    // db.close();
  });
})
