import { BucketConfiguration } from '../Bucket/BucketConfiguration';
import { Collection } from './Collection';
import { Db, InsertOneResult, UpdateResult } from 'mongodb';
import { CollectionReference } from '@google-cloud/firestore';
import { MongoDbCollection } from '../type/database.enum';

export class MongoCollection<T> extends Collection<T> {
  constructor(config: BucketConfiguration, db: Db, name: string) {
    super(config, db, name);
    this.ref = db.collection<T>(name);
  }
  // CRUD
  // Create
  public async createOne<T>(_id: string | number, document: T): any {
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const colRef: MongoDbCollection<T> = this.ref as MongoDbCollection<T>;
    const result: InsertOneResult<T> = await colRef.insertOne(document);
    return result;
  }

  public async createMany<T>(creates: [string | number, T][]) {
    const colRef: MongoDbCollection<T> = this.ref as MongoDbCollection<T>;
    const newDocuments: T[] = creates.map(([id, doc]) => doc);
    const result = await colRef.insertMany(newDocuments);
    return result;
  }
  // Read
  public async findOneById<T>(id: string | number) {}
  // Update
  public async updateOneById<T>(id: string | number, document: T): Promise<UpdateResult> {
    const colRef: MongoDbCollection<T> = this.ref as MongoDbCollection<T>;
    const result: UpdateResult = await colRef.updateOne({ _id: id }, { $set: document });
    return result;
  }

  public async updateAllById<T>(updates: [string | number, T][]): Promise<UpdateResult[]> {
    const colRef: MongoDbCollection<T> = this.ref as MongoDbCollection<T>;
    const updatePromises = updates.map(async ([id, document]) => {
      const result: UpdateResult = await colRef.updateOne({ _id: id }, { $set: document });
      return result;
    });

    const updateResults = await Promise.all(updatePromises);
    return updateResults;
  }

  // Delete

  public async deleteOneByID<T> (id: string | number): Promise<DeleteResult> {
    const colRef: MongoDbCollection<T> = this.ref as MongoDbCollection<T>;
    const result: UpdateResult = await colRef.deleteOne(
        { _id: id }
    );
    return result;
  }

  public async deleteManyByID<T> (deletes: [string | number][]): Promise<DeleteResult[]> {
    const colRef: MongoDbCollection<T> = this.ref as MongoDbCollection<T>;
    const deletePromises = deletes.map(async (id) => {
      const result: DeleteResult = await colRef.deleteOne(id);
      return result;
    });

    const deleteResults = await Promise.all(deletePromises);
    return deleteResults;
  }
}
