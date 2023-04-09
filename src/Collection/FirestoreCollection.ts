import { BucketConfiguration } from '../Bucket/BucketConfiguration';
import { Collection } from './Collection';
import { firestore } from 'firebase-admin';
import Firestore = firestore.Firestore;
import { CollectionReference } from '@google-cloud/firestore';

export class FirestoreCollection<T> extends Collection<T>{

  constructor(config: BucketConfiguration, db: Firestore, name: string) {
    super(config, db, name);
    this.ref = db.collection(name) as CollectionReference<T>
  }
  public async insertOne<T>(_id: string | number, document: T): any {
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const colRef: CollectionReference<T> = this.ref as CollectionReference<T>;
    const result: FirebaseFirestore.WriteResult = await colRef.doc(id).set(document);
    return result;
  }
  // Read
  public async findOneById<T>(id: string | number) {

  }
}
