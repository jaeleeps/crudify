import { Bucket } from '../src/Bucket/Bucket';
import { testFirebaseConfig } from './env/testFirebaseConfig';
import { BucketConfiguration } from '../src/Bucket/BucketConfiguration';
import { FirestoreBucketConfiguration } from '../src/Bucket/FirestoreBucketConfiguration';
import { IFirestoreConfiguration } from '../src/Bucket/FirestoreConfiguration.interface';
import { AppDatabase, MongoDbCollection } from '../src/type/database.enum';
import { IUser } from './Test.interface';
import { testMongoDBAtlasPassword } from './env/testMongoDBAtlasConfig';
import { IMongoConfiguration } from '../src/Bucket/MongoConfiguration.interface';
import { MongoBucketConfiguration } from '../src/Bucket/MongoBucketConfiguration';
import { CollectionReference } from '@google-cloud/firestore';
import { Collection } from '../src/Collection/Collection';

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

  const collection: CollectionReference<IUser> = db.collection('users') as CollectionReference<IUser>;

  const newUserRef = await collection.doc(newUser.id).set(newUser);

  // Read the user document from Firestore
  const userRef: FirebaseFirestore.DocumentSnapshot<IUser> = await collection.doc(newUser.id).get();
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

  const usersCollection: MongoDbCollection<IUser> = db.collection<IUser>('users');
  await usersCollection.insertOne(newUser);

  // Read the user document from MongoDB
  const user = await usersCollection.findOne({ id: newUser.id });

  console.log(user);
  expect(user.id).toBe(newUser.id);
  expect(user.name).toBe(newUser.name);
  expect(user.email).toBe(newUser.email);
})

test("Firebase_Collection_C/R", async () => {
  const config: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
  const bucket: Bucket = new Bucket(firebaseBucketConfig);

  const db: AppDatabase = await bucket.initialize();

  const newUser: IUser = {
    id: '1234',
    name: 'John Doe',
    email: 'johndoe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const firestoreCollection: CollectionReference<IUser> = db.collection('users') as CollectionReference<IUser>;
  const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

  // const newUserRef: WriteResult = await firestoreCollection.doc(newUser.id).set(newUser);
  const result = collection.insertOne<IUser>(newUser.id, newUser);
  console.log(result);

  // Read the user document from Firestore
  const userRef: FirebaseFirestore.DocumentSnapshot<IUser> = await firestoreCollection.doc(newUser.id).get();
  const user: IUser = userRef.data() as IUser;

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
    id: '1234',
    name: 'John Doe',
    email: 'johndoe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mongoCollection: MongoDbCollection<IUser> = db.collection<IUser>('users');
  const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

  // await mongoCollection.insertOne(newUser);
  const result = await collection.insertOne<IUser>(newUser.id, newUser);
  const userID = result.insertedId;
  console.log(result);

  // Read the user document from MongoDB
  const user = await mongoCollection.findOne({ _id: userID });

  console.log(user._id.toString());
  expect(user.id).toBe(newUser.id);
  expect(user.name).toBe(newUser.name);
  expect(user.email).toBe(newUser.email);

  const updatedUser: IUser = {
    id: '1234',
    name: 'More Updated John Doe',
    email: 'updatedjohndoe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updateResult = await collection.updateOneById(userID, updatedUser);
  console.log(updateResult);

  const confirmupdatedUser = await mongoCollection.findOne({_id: userID});

  console.log(confirmupdatedUser);
  expect(confirmupdatedUser.id).toBe(updatedUser.id);
  expect(confirmupdatedUser.name).toBe(updatedUser.name);
})
