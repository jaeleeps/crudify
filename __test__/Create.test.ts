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
  const bucket: Bucket = new Bucket(firebaseBucketConfig, "test_bucket");

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

  const bucket: Bucket = new Bucket(mongoBucketConfig, "test_bucket");

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
  const bucket: Bucket = new Bucket(firebaseBucketConfig, "test_bucket");

  const db: AppDatabase = await bucket.initialize();

  const newUser: IUser = {
    id: '903313404_00_01',
    name: 'John Doe',
    email: 'johndoe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const firestoreCollection: CollectionReference<IUser> = db.collection('users') as CollectionReference<IUser>;
  const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

  // const newUserRef: WriteResult = await firestoreCollection.doc(newUser.id).set(newUser);
  const result = collection.createOne<IUser>(newUser.id, newUser);
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

  const bucket: Bucket = new Bucket(mongoBucketConfig, "test_bucket");

  const db: AppDatabase = await bucket.initialize();

  const newUser: IUser = {
    id: '903313404_00_02',
    name: 'John Doe',
    email: 'johndoe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mongoCollection: MongoDbCollection<IUser> = db.collection<IUser>('users');
  const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

  // await mongoCollection.insertOne(newUser);
  const result = await collection.createOne<IUser>(newUser.id, newUser);
  console.log(result);

  // Read the user document from MongoDB
  const user = await mongoCollection.findOne({ id: newUser.id });

  console.log(user);
  expect(user.id).toBe(newUser.id);
  expect(user.name).toBe(newUser.name);
  expect(user.email).toBe(newUser.email);
})


test("Firebase_Collection_C/R/Many", async () => {
  const config: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
  const bucket: Bucket = new Bucket(firebaseBucketConfig, "test_bucket");

  const db: AppDatabase = await bucket.initialize();
  const dateString: string = Date.now().toString();

  const newUsers: IUser[] = [
    {
      id: '903313404_00_03_' + dateString + '_01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '903313404_00_03_' + dateString + '_02',
      name: 'John Doe',
      email: 'johndoe@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '903313404_00_03_' + dateString + '_03',
      name: 'John Doe',
      email: 'johndoe@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  const creates: [string|number, IUser][] = newUsers.map((user: IUser) => [user.id, user]);

  const firestoreCollection: CollectionReference<IUser> = db.collection('users') as CollectionReference<IUser>;
  const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

  const result = collection.createMany<IUser>(creates);
  console.log(result);

  // Read the user document from Firestore
  const userRef1: FirebaseFirestore.DocumentSnapshot<IUser> = await firestoreCollection.doc(newUsers[0].id).get();
  const user1: IUser = userRef1.data() as IUser;
  const userRef2: FirebaseFirestore.DocumentSnapshot<IUser> = await firestoreCollection.doc(newUsers[1].id).get();
  const user2: IUser = userRef2.data() as IUser;
  const userRef3: FirebaseFirestore.DocumentSnapshot<IUser> = await firestoreCollection.doc(newUsers[2].id).get();
  const user3: IUser = userRef3.data() as IUser;

  console.log(user1);
  expect(user1.id).toBe(newUsers[0].id);
  console.log(user2);
  expect(user2.id).toBe(newUsers[1].id);
  console.log(user3);
  expect(user3.id).toBe(newUsers[2].id);
})

test("Mongo_Collection_C/R/Many", async () => {
  const password: string = testMongoDBAtlasPassword;
  const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
  const mongoConfig: IMongoConfiguration = { uri: connectionURI, database: "airbnb" };
  const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(mongoConfig);

  const bucket: Bucket = new Bucket(mongoBucketConfig, "test_bucket");

  const db: AppDatabase = await bucket.initialize();

  const dateString: string = Date.now().toString();

  const newUsers: IUser[] = [
    {
      id: '903313404_00_03_' + dateString + '_01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '903313404_00_03_' + dateString + '_02',
      name: 'John Doe',
      email: 'johndoe@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '903313404_00_03_' + dateString + '_03',
      name: 'John Doe',
      email: 'johndoe@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  const mongoCollection: MongoDbCollection<IUser> = db.collection<IUser>('users');
  const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

  const creates: [string|number, IUser][] = newUsers.map((user: IUser) => [user.id, user]);

  // await mongoCollection.insertOne(newUser);
  const result = await collection.createMany<IUser>(creates);
  console.log(result);

  // Read the user document from MongoDB
  const user1 = await mongoCollection.findOne({ id: newUsers[0].id });
  const user2 = await mongoCollection.findOne({ id: newUsers[1].id });
  const user3 = await mongoCollection.findOne({ id: newUsers[2].id });

  console.log(user1);
  expect(user1.id).toBe(newUsers[0].id);
  console.log(user2);
  expect(user2.id).toBe(newUsers[1].id);
  console.log(user3);
  expect(user3.id).toBe(newUsers[2].id);
})
