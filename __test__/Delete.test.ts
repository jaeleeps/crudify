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
import {ObjectId} from "mongodb";


test("Firebase_Collection_DeleteOne", async () => {
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

    const result = collection.insertOne<IUser>(newUser.id, newUser);
    console.log(result);

    let userRef: FirebaseFirestore.DocumentSnapshot<IUser> = await firestoreCollection.doc(newUser.id).get();
    const ogUser: IUser = userRef.data() as IUser;
    console.log(ogUser);
    expect(ogUser.id).toBe(newUser.id);
    expect(ogUser.name).toBe(newUser.name);
    expect(ogUser.email).toBe(newUser.email);

    const updatedResult = collection.deleteOneByID(ogUser.id);

    userRef = await firestoreCollection.doc(newUser.id).get();
    const user: IUser = userRef.data() as IUser;

    console.log(user);
    expect(user).toBe(undefined);
})

test("Firebase_Collection_DeleteMany", async () => {
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
    for (let i = 0; i <count; i++) {
        const result = await firestoreCollection.doc(ogUsers[i].id).set(ogUsers[i]);
        ogIds.push(ogUsers[i].id);
        ogNames.push(ogUsers[i].name);
    }
    for (let i = 0; i <count; i++) {
        const insertedUser = await firestoreCollection.doc(ogIds[i]).get();
        const userData = insertedUser.data() as IUser;
        console.log(userData);
        expect(userData.name).toBe(ogNames[i]);
    }

    const testResult = await collection.deleteManyByID(ogIds);
    console.log(testResult);
    for (let i = 0; i <count; i++) {
        const deletedUser = await firestoreCollection.doc(ogIds[i]).get();
        const userData = deletedUser.data() as IUser;
        console.log(userData);
        expect(userData).toBe(undefined);
    }

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

test("Mongo_Collection_DeleteOne", async () => {
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

    const result = await collection.insertOne<IUser>(newUser.id, newUser);
    const userID = result.insertedId;
    console.log(result);

    const user = await mongoCollection.findOne({ _id: userID });

    const updateResult = await collection.deleteOneByID(userID);
    console.log(updateResult);

    const deletedUser = await mongoCollection.findOne({_id: userID});

    console.log(deletedUser);
    expect(deletedUser).toBe(null);
})

test("Mongo_Collection_DeleteMany", async () => {
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


    const originalUsers = await mongoCollection.find({}).limit(5).toArray();
    const userIDs : ObjectId[] = [];

    for (let i = 0; i < count; i++) {
        userIDs.push(originalUsers[i]._id);
    }

    console.log(userIDs);
    const updateResult = await collection.deleteManyByID(userIDs);
    console.log(updateResult);

    const afterUsers : string[] = [];
    for (let i = 0; i < count; i++) {
        const after = await mongoCollection.findOne({_id: userIDs[i]});
        afterUsers.push(after);
    }
    console.log(afterUsers);
    for (let i = 0; i < count; i++) {
        expect(afterUsers[i]).toBe(null);
    }

})