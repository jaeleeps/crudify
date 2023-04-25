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

    let userRef: FirebaseFirestore.DocumentSnapshot<IUser> = await firestoreCollection.doc(newUser.id).get();
    const ogUser: IUser = userRef.data() as IUser;
    console.log(ogUser);
    expect(ogUser.id).toBe(newUser.id);
    expect(ogUser.name).toBe(newUser.name);
    expect(ogUser.email).toBe(newUser.email);

    const findResult = collection.findOneById(ogUser.id);
    const foundUser: IUser = userRef.data() as IUser;


    expect(foundUser.id).toBe(ogUser.id);
    expect(foundUser.name).toBe(ogUser.name);
    expect(foundUser.email).toBe(ogUser.email);
})