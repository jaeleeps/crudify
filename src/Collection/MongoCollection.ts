import { BucketConfiguration } from '../Bucket/BucketConfiguration';
import { Collection } from './Collection';

import {
  Condition,
  Db,
  DeleteResult,
  Filter,
  FindCursor,
  InsertManyResult,
  InsertOneResult,
  ObjectId,
  OptionalUnlessRequiredId,
  RegExpOrString,
  UpdateResult,
  WithId,
} from 'mongodb';

import { CollectionReference } from '@google-cloud/firestore';
import { MongoDbCollection } from '../type/database.enum';
import { IUser } from '../../__test__/Test.interface';

export class MongoCollection<T> extends Collection<T> {
  constructor(config: BucketConfiguration, db: Db, name: string) {
    super(config, db, name);
    this.ref = db.collection<T>(name);
  }
  // CRUD
  // Create
  public async createOne<T>(_id: string | number, document: T): Promise<InsertOneResult> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const result: InsertOneResult<T> = await colRef.insertOne(document as OptionalUnlessRequiredId<T>);
    return result;
  }

  public async createMany<T>(creates: [string | number, T][]): Promise<InsertManyResult> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const newDocuments: T[] = creates.map(([id, doc]) => doc);
    const result: InsertManyResult = await colRef.insertMany(newDocuments as OptionalUnlessRequiredId<T>[]);
    return result;
  }
  // Read
  public async readOneById<T>(_id: string | number): Promise<WithId<T> | null> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const result: WithId<T> | null = await colRef.findOne({ id: _id } as unknown as Filter<T>);
    return result;
  }

  public async readManyById<T>(ids: (string | number)[]): Promise<(WithId<T> | null)[]> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const findCursor: FindCursor = await colRef.find({ id: { $in: ids } as unknown as RegExpOrString<WithId<T>> });
    const findResults = findCursor.toArray();
    return findResults;
  }

  // Update
  public async updateOneById<T>(id: string | number, document: T): Promise<UpdateResult> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const result: UpdateResult = await colRef.updateOne({ id: id } as unknown as Filter<T>, { $set: document });
    return result;
  }

  public async updateManyById<T>(updates: [string | number, T][]): Promise<UpdateResult[]> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const updatePromises = updates.map(async ([id, document]) => {
      const result: UpdateResult = await colRef.updateOne({ id: id } as unknown as Filter<T>, { $set: document });
      return result;
    });
    const updateResults = await Promise.all(updatePromises);
    return updateResults;
  }

  // Delete

  public async deleteOneById<T>(id: string | number): Promise<DeleteResult> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const result: DeleteResult = await colRef.deleteOne({ id: id } as unknown as Filter<T>);
    return result;
  }

  public async deleteManyById<T>(ids: [string | number][]): Promise<DeleteResult> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const deleteResults = await colRef.deleteMany({ id: { $in: ids } as unknown as Filter<T> });
    return deleteResults;
  }
}
