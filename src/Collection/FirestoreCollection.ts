import { BucketConfiguration } from '../Bucket/BucketConfiguration';
import { Collection } from './Collection';
import { firestore } from 'firebase-admin';
import Firestore = firestore.Firestore;
import { CollectionReference, DocumentReference } from '@google-cloud/firestore';
import firebase from 'firebase';
import WriteBatch = firebase.firestore.WriteBatch;
import WriteResult = firestore.WriteResult;
import UpdateData = firestore.UpdateData;

export class FirestoreCollection<T> extends Collection<T> {
  constructor(config: BucketConfiguration, db: Firestore, name: string) {
    super(config, db, name);
    this.ref = db.collection(name) as unknown as CollectionReference<T>;
  }
  public async createOne<T>(_id: string | number, document: T): Promise<FirebaseFirestore.WriteResult> {
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const colRef: CollectionReference<T> = this.ref as unknown as CollectionReference<T>;
    const result: FirebaseFirestore.WriteResult = await colRef.doc(id).set(document);
    return result;
  }

  public async createMany<T>(creates: [string | number, T][]): Promise<FirebaseFirestore.WriteResult[]> {
    const colRef: CollectionReference<T> = this.ref as unknown as CollectionReference<T>;
    const batch: FirebaseFirestore.WriteBatch = (this.db as Firestore).batch();

    const createPromises = creates.map(([id, document]) => {
      const docId: string = typeof id === 'string' ? id : id.toString();
      const docRef: DocumentReference<T> = colRef.doc(docId);
      batch.set(docRef, document);
    });

    const result: FirebaseFirestore.WriteResult[] = await batch.commit();
    return result;
  }

  // Read
  public async findOneById<T>(_id: string | number): Promise<T | null> {
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const colRef: CollectionReference<T> = this.ref as unknown as CollectionReference<T>;
    const result = await colRef.doc(id).get();
    const ret: T | null = result.data();
    return ret;
  }

  public async findManyById<T>(finds: [string | number, T][]): Promise<(T | null)[]> {
    const colRef: CollectionReference<T> = this.ref as unknown as CollectionReference<T>;
    const findPromises = finds.map(([id]) => {
      const docId: string = typeof id === 'string' ? id : id.toString();
      return colRef.doc(docId).get();
    });

    const findResults = await Promise.all(findPromises);
    const ret = [];
    findResults.forEach((el) => ret.push(el.data()));
    return ret;
  }

  // Update
  public async updateOneById<T>(_id: string | number, document: T): Promise<FirebaseFirestore.WriteResult> {
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const colRef: CollectionReference<T> = this.ref as unknown as CollectionReference<T>;
    const result: FirebaseFirestore.WriteResult = await colRef.doc(id).update(document as UpdateData<T>);
    return result;
  }

  public async updateAllById<T>(updates: [string | number, T][]): Promise<FirebaseFirestore.WriteResult[]> {
    const colRef: CollectionReference<T> = this.ref as unknown as CollectionReference<T>;
    const updatePromises = updates.map(([id, document]) => {
      const docId: string = typeof id === 'string' ? id : id.toString();
      return colRef.doc(docId).update(document as UpdateData<T>);
    });

    const updateResults = await Promise.all(updatePromises);
    return updateResults;
  }

  public async deleteOneByID<T>(_id: string | number): Promise<FirebaseFirestore.WriteResult> {
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const colRef: CollectionReference<T> = this.ref as unknown as CollectionReference<T>;
    const result: FirebaseFirestore.WriteResult = await colRef.doc(id).delete();
    return result;
  }

  public async deleteManyByID<T>(deletes: [string | number][]): Promise<FirebaseFirestore.WriteResult[]> {
    const colRef: CollectionReference<T> = this.ref as unknown as CollectionReference<T>;
    const deletePromises = deletes.map((id) => {
      const docId: string = typeof id === 'string' ? id : id.toString();
      return colRef.doc(docId).delete();
    });

    const deleteResults = await Promise.all(deletePromises);
    return deleteResults;
  }
}
