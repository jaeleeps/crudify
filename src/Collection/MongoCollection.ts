import { BucketConfiguration } from '../Bucket/BucketConfiguration';
import { Collection } from './Collection';
import { Db, InsertOneResult } from 'mongodb';
import { CollectionReference } from '@google-cloud/firestore';
import { MongoDbCollection } from '../type/database.enum';

export class MongoCollection<T> extends Collection<T>{

  constructor(config: BucketConfiguration, db: Db, name: string) {
    super(config, db, name);
    this.ref = db.collection<T>(name);
  }
  // CRUD
  // Create
  public async insertOne<T>(_id: string | number, document: T): any {
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const colRef: MongoDbCollection<T> = this.ref as MongoDbCollection<T>;
    const result: InsertOneResult<T> = await colRef.insertOne(document);
    return result;
  }
  // Read
  public async findOneById<T>(id: string | number) {

  }
  // Update

  // Delete
}
