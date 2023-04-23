import { BucketConfiguration } from '../Bucket/BucketConfiguration';
import { Collection } from './Collection';
import { firestore } from 'firebase-admin';
import Firestore = firestore.Firestore;
import { CollectionReference, DocumentReference } from '@google-cloud/firestore';
import firebase from 'firebase';
import WriteBatch = firebase.firestore.WriteBatch;
import WriteResult = firestore.WriteResult;

export class FirestoreCollection<T> extends Collection<T> {
  constructor(config: BucketConfiguration, db: Firestore, name: string) {
    super(config, db, name);
    this.ref = db.collection(name) as CollectionReference<T>;
  }
  public async createOne<T>(_id: string | number, document: T): any {
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const colRef: CollectionReference<T> = this.ref as CollectionReference<T>;
    const result: FirebaseFirestore.WriteResult = await colRef.doc(id).set(document);
    return result;
  }

  public async createMany<T>(creates: [string | number, T][]) {
    const colRef: CollectionReference<T> = this.ref as CollectionReference<T>;
    const batch: FirebaseFirestore.WriteBatch = (this.db as Firestore).batch();

    const createPromises = creates.map(([id, document]) => {
      const docId: string = typeof id === 'string' ? id : id.toString();
      const docRef: DocumentReference<T> = colRef.doc(id);
      batch.set(docRef, document);
    });

    const result: Promise<WriteResult[]> = await batch.commit();
    return result;
  }

  // Read
  public async findOneById<T>(id: string | number) {}

  // Update
  public async updateOneById<T>(_id: string | number, document: T): Promise<FirebaseFirestore.WriteResult> {
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const colRef: CollectionReference<T> = this.ref as CollectionReference<T>;
    const result: FirebaseFirestore.WriteResult = await colRef.doc(id).update(document);
    return result;
  }

  public async updateAllById<T>(updates: [string | number, T][]): Promise<FirebaseFirestore.WriteResult[]> {
    const colRef: CollectionReference<T> = this.ref as CollectionReference<T>;
    const updatePromises = updates.map(([id, document]) => {
      const docId: string = typeof id === 'string' ? id : id.toString();
      return colRef.doc(docId).update(document);
    });

    const updateResults = await Promise.all(updatePromises);
    return updateResults;
  }

  // Delete
}
