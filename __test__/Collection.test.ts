import { Bucket } from '../src/Bucket/Bucket';
import { testFirebaseConfig } from './env/testFirebaseConfig';
import { testMongoDBAtlasPassword } from './env/testMongoDBAtlasConfig';
import { BucketConfiguration } from '../src/Bucket/BucketConfiguration';
import { FirestoreBucketConfiguration } from '../src/Bucket/FirestoreBucketConfiguration';
import { IFirestoreConfiguration } from '../src/Bucket/FirestoreConfiguration.interface';
import { IMongoConfiguration } from '../src/Bucket/MongoConfiguration.interface';
import { MongoBucketConfiguration } from '../src/Bucket/MongoBucketConfiguration';
import { AppDatabase } from '../src/type/database.enum';
import { IUser } from './Test.interface';
import { Collection } from '../src/Collection/Collection';
import {testRun} from "../src/Jobs/MongoListingJob";

test("Firebase_Collection_Initialization", async () => {
  const config: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
  const firebaseBucket: Bucket = new Bucket(firebaseBucketConfig);
  const db: AppDatabase = await firebaseBucket.initialize();
  expect(db).not.toBe(null);
  const collection: Collection<IUser> = firebaseBucket.addCollection<IUser>('users');
  console.log(collection.ref);
  expect(collection.ref).not.toBe(null);
})


test("Mongo_Collection_Initialization", async () => {
  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const config: IMongoConfiguration = { uri: connectionURI, database: "airbnb" };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(config);
  const mongoBucket: Bucket = new Bucket(mongoBucketConfig);

  const db: AppDatabase = await mongoBucket.initialize();
  expect(db).not.toBe(null);
  const collection: Collection<IUser> = mongoBucket.addCollection<IUser>('users');
  console.log(collection.ref);
  expect(collection.ref).not.toBe(null);
})
