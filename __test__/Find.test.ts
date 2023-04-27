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

test("Firebase_Find_One", async() => {
    const config: IFirestoreConfiguration = testFirebaseConfig;
    const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
    const bucket: Bucket = new Bucket(firebaseBucketConfig, "test_bucket");

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

    const result = collection.createOne<IUser>(newUser.id, newUser);
    console.log(result);

    const userRef: FirebaseFirestore.DocumentSnapshot<IUser> = await firestoreCollection.doc(newUser.id).get();
    const ogUser: IUser = userRef.data() as IUser;
    console.log(ogUser);
    expect(ogUser.id).toBe(newUser.id);
    expect(ogUser.name).toBe(newUser.name);
    expect(ogUser.email).toBe(newUser.email);

    const findResult = await collection.readOneById(ogUser.id);
    console.log(findResult);
    const foundUser: IUser = findResult as IUser;


    expect(foundUser.id).toBe(ogUser.id);
    expect(foundUser.name).toBe(ogUser.name);
    expect(foundUser.email).toBe(ogUser.email);
})

test("Firebase_Find_Many", async() => {
    const config: IFirestoreConfiguration = testFirebaseConfig;
    const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
    const bucket: Bucket = new Bucket(firebaseBucketConfig, "test_bucket");
    const count = 5;
    const db: AppDatabase = await bucket.initialize();


    const firestoreCollection: CollectionReference<IUser> = db.collection('users') as CollectionReference<IUser>;
    const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

    const newUsers: IUser[] = [
        {
            id: '1234',
            name: 'John Doe',
            email: 'johndoe@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '5678',
            name: 'John Doe',
            email: 'johndoe@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '11990',
            name: 'John Doe',
            email: 'johndoe@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    const creates: [string|number, IUser][] = newUsers.map((user: IUser) => [user.id, user]);

    const result = collection.createMany<IUser>(creates);

    const finds: (string|number)[] = newUsers.map((user: IUser) => user.id);

    const findResult = await collection.readManyById(finds);


    expect(findResult[0].id).toBe(newUsers[0].id);
    expect(findResult[1].id).toBe(newUsers[1].id);
    expect(findResult[2].id).toBe(newUsers[2].id);
    expect(findResult[0].name).toBe(newUsers[0].name);
    expect(findResult[1].name).toBe(newUsers[1].name);
    expect(findResult[2].name).toBe(newUsers[2].name);
    expect(findResult[0].email).toBe(newUsers[0].email);
    expect(findResult[1].email).toBe(newUsers[1].email);
    expect(findResult[2].email).toBe(newUsers[2].email);

})

test("Mongo_Find_One", async() => {
    const password: string = testMongoDBAtlasPassword;
    const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
    const mongoConfig: IMongoConfiguration = { uri: connectionURI, database: "airbnb" };
    const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(mongoConfig);

    const bucket: Bucket = new Bucket(mongoBucketConfig, "test_bucket");

    const db: AppDatabase = await bucket.initialize();

    const newUser: IUser = {
        id: '2003',
        name: 'Karam Jivani',
        email: 'johndoe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mongoCollection: MongoDbCollection<IUser> = db.collection<IUser>('users');
    const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

    const result = await collection.createOne<IUser>(newUser.id, newUser);
    const userID = result.insertedId;
    console.log(result);

    const user = await mongoCollection.findOne({ _id: userID });
    // console.log(user);

    const findResult = await collection.readOneById(newUser.id);
    // console.log(findResult);
    const foundUser: IUser = findResult as IUser;


    expect(foundUser.id).toBe(newUser.id);
    expect(foundUser.name).toBe(newUser.name);
    expect(foundUser.email).toBe(newUser.email);
})

test("Mongo_Find_Many", async() => {
    const password: string = testMongoDBAtlasPassword;
    const connectionURI: string = `mongodb+srv://jaeleeps:${password}@cluster0.cfhx0ec.mongodb.net/?retryWrites=true&w=majority`;
    const mongoConfig: IMongoConfiguration = { uri: connectionURI, database: "airbnb" };
    const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(mongoConfig);

    const bucket: Bucket = new Bucket(mongoBucketConfig, "test_bucket");

    const db: AppDatabase = await bucket.initialize();

    const newUsers: IUser[] = [
        {
            id: '123123',
            name: 'John Doe',
            email: 'johndoe@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '125235',
            name: 'John Doe',
            email: 'johndoe@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '11990',
            name: 'John Doe',
            email: 'johndoe@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    const mongoCollection: MongoDbCollection<IUser> = db.collection<IUser>('users');
    const collection: Collection<IUser> = bucket.addCollection<IUser>('users');

    const results = await mongoCollection.insertMany(newUsers);

    const finds: (string|number)[] = newUsers.map((user: IUser) => user.id);

    const findResult = await collection.readManyById(finds);
    console.log(findResult);

    expect(findResult[0].id).toBe(newUsers[0].id);
    expect(findResult[1].id).toBe(newUsers[1].id);
    expect(findResult[2].id).toBe(newUsers[2].id);
    expect(findResult[0].name).toBe(newUsers[0].name);
    expect(findResult[1].name).toBe(newUsers[1].name);
    expect(findResult[2].name).toBe(newUsers[2].name);
    expect(findResult[0].email).toBe(newUsers[0].email);
    expect(findResult[1].email).toBe(newUsers[1].email);
    expect(findResult[2].email).toBe(newUsers[2].email);

})
