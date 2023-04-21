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
import * as dns from "dns";
import {ObjectId} from "mongodb";
import * as string_decoder from "string_decoder";

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

test("Firebase_Collection_UpdateOne", async () => {
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

  let userRef: FirebaseFirestore.DocumentSnapshot<IUser> = await firestoreCollection.doc(newUser.id).get();
  const ogUser: IUser = userRef.data() as IUser;
  console.log(ogUser);
  expect(ogUser.id).toBe(newUser.id);
  expect(ogUser.name).toBe(newUser.name);
  expect(ogUser.email).toBe(newUser.email);

  const updatedUser: IUser = {
    id: '1234',
    name: 'John Doe Updated',
    email: 'johndoe@example.com updated',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const updatedResult = collection.updateOneById(newUser.id, updatedUser);
  // Read the user document from Firestore
  userRef = await firestoreCollection.doc(newUser.id).get();
  const user: IUser = userRef.data() as IUser;

  console.log(user);
  expect(user.id).toBe(updatedUser.id);
  expect(user.name).toBe(updatedUser.name);
  expect(user.email).toBe(updatedUser.email);
})


test("Firebase_Collection_UpdateMany", async () => {
  const config: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
  const bucket: Bucket = new Bucket(firebaseBucketConfig);
  const count = 5;
  const db: AppDatabase = await bucket.initialize();

  const ogUsers : IUser[] = generateUsers(count);

  const firestoreCollection: CollectionReference<IUser> = db.collection('users') as CollectionReference<IUser>;
  const collection: Collection<IUser> = bucket.addCollection<IUser>('users');
  const ogIds : string[] = [];
  const ogNames : string[] = [];
  const updatedNames : string[] = [];
  const updatingUsers = [];
  for (let i = 0; i <count; i++) {
    const result = await firestoreCollection.doc(ogUsers[i].id).set(ogUsers[i]);
    ogIds.push(ogUsers[i].id);
    ogNames.push(ogUsers[i].name);
    const newName : string = ogUsers[i].name + " updated " + i;
    updatedNames.push(newName);
    ogUsers[i].name = newName;
    updatingUsers.push([ogUsers[i].id, ogUsers[i]]);
  }

  for (let i = 0; i <count; i++) {
    const insertedUser = await firestoreCollection.doc(ogIds[i]).get();
    const userData = insertedUser.data() as IUser;
    console.log(userData);
    expect(userData.name).toBe(ogNames[i]);
  }

  const testResult = await collection.updateAllById(updatingUsers);
  console.log(testResult);
  for (let i = 0; i <count; i++) {
    const updatedUser = await firestoreCollection.doc(ogIds[i]).get();
    const userData = updatedUser.data() as IUser;
    console.log(userData);
    expect(userData.name).toBe(updatedNames[i]);
  }


})

test("Mongo_Collection_UpdateOne", async () => {
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

function generateUsers(count: number) : IUser[] {
  const newUsers : IUser[] = [];
  for (let i = 0; i < count; i++) {
    const newUser: IUser = {
      id: '1234' + i,
      name: 'John Doe Version' + i,
      email: 'johndoe@example.com' + i,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    newUsers.push(newUser);
  }
  return newUsers;
}
test("Mongo_Collection_UpdateMany", async () => {
  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const mongoConfig: IMongoConfiguration = { uri: connectionURI, database: "airbnb" };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(mongoConfig);
  const count = 5;
  const bucket: Bucket = new Bucket(mongoBucketConfig);

  const db: AppDatabase = await bucket.initialize();


  const newUsers : IUser[] = generateUsers(count);

  const mongoCollection: MongoDbCollection<IUser> = db.collection<IUser>('users');
  const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

  const results = await mongoCollection.insertMany(newUsers);


  // Read the user document from MongoDB
  const originalUsers = await mongoCollection.find({}).limit(5).toArray();
  const userIDs : ObjectId[] = [];
  const oguserNames : string[] = [];
  const updatingUsers  = [];
  for (let i = 0; i < count; i++) {
    userIDs.push(originalUsers[i]._id);
    oguserNames.push(originalUsers[i].name);
    originalUsers[i].name = originalUsers[i].name + " Updated" + i;
    updatingUsers.push([originalUsers[i]._id, originalUsers[i]]);
  }
  console.log(userIDs);
  const updateResult = await collection.updateAllById(updatingUsers);
  console.log(updateResult);

  const afterNames : string[] = [];
  for (let i = 0; i < count; i++) {
    const after = await mongoCollection.findOne({_id: userIDs[i]});
    afterNames.push(after.name);
  }
  console.log(afterNames);
  for (let i = 0; i < count; i++) {
    expect(afterNames[i]).toBe(oguserNames[i] + " Updated" + i);
  }

})