import { Bucket } from '../src/Bucket/Bucket';
import { testFirebaseConfig } from './env/tesFirebaseConfig';
import { BucketConfiguration } from '../src/Bucket/BucketConfiguration';
import { FirestoreBucketConfiguration } from '../src/Bucket/FirestoreBucketConfiguration';
import { IFirestoreConfiguration } from '../src/Bucket/FirestoreConfiguration.interface';
import { AppClient } from '../src/type/database.enum';
import { app, firestore } from 'firebase-admin';
import { IUser } from './Test.interface';
import App = app.App;
import Firestore = firestore.Firestore;

test("Firebase Bucket Initialization Test", async () => {
  const config: IFirestoreConfiguration = testFirebaseConfig;
  const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
  const firebaseBucket: Bucket = new Bucket(firebaseBucketConfig);

  const appClient: AppClient = await firebaseBucket.initialize();
  const db: Firestore = (appClient as App).firestore();
  const usersCollection = db.collection<IUser>('users');
  console.log(usersCollection);
})
