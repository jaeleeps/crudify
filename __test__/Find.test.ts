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

    const result = collection.createOne<IUser>(newUser.id, newUser);
    console.log(result);

    const userRef: FirebaseFirestore.DocumentSnapshot<IUser> = await firestoreCollection.doc(newUser.id).get();
    const ogUser: IUser = userRef.data() as IUser;
    console.log(ogUser);
    expect(ogUser.id).toBe(newUser.id);
    expect(ogUser.name).toBe(newUser.name);
    expect(ogUser.email).toBe(newUser.email);

    const findResult = await collection.findOneById(ogUser.id);
    console.log(findResult);
    const foundUser: IUser = findResult as IUser;


    expect(foundUser.id).toBe(ogUser.id);
    expect(foundUser.name).toBe(ogUser.name);
    expect(foundUser.email).toBe(ogUser.email);
})

test("Firebase_Find_Many", async() => {
    const config: IFirestoreConfiguration = testFirebaseConfig;
    const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
    const bucket: Bucket = new Bucket(firebaseBucketConfig);
    const count = 5;
    const db: AppDatabase = await bucket.initialize();

    const ogUsers : IUser[] = generateUsers(count);

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

    const finds: [string|number, IUser][] = newUsers.map((user: IUser) => [user.id, user]);

    const result = collection.createMany<IUser>(finds);

    const findResult = await collection.findManyById(finds);


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