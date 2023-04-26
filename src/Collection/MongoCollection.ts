import { BucketConfiguration } from '../Bucket/BucketConfiguration';
import { Collection } from './Collection';

import {
  Db,
  DeleteResult,
  Filter,
  InsertManyResult,
  InsertOneResult,
  OptionalUnlessRequiredId,
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
    const id: string = typeof _id === 'string' ? _id : _id.toString();
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
  public async findOneById<T>(_id: string | number): Promise<WithId<T> | null> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const id: string = typeof _id === 'string' ? _id : _id.toString();
    const result: WithId<T> | null = await colRef.findOne({ id: id } as unknown  as Filter<T>);
    return result;
  }

  public async findManyById<T>(finds: [string | number, T][]): Promise<(WithId<T> | null)[]> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const findPromises = finds.map(([id]) => {
      const docId: string = typeof id === 'string' ? id : id.toString();
      return colRef.findOne({ id: docId } as unknown as Filter<T>);
    });
    const findResults = await Promise.all(findPromises);
    return findResults;
  }

  // Update
  public async updateOneById<T>(id: string | number, document: T): Promise<UpdateResult> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const result: UpdateResult = await colRef.updateOne({ _id: id } as Filter<T>, { $set: document });
    return result;
  }

  public async updateManyById<T>(updates: [string | number, T][]): Promise<UpdateResult[]> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const updatePromises = updates.map(async ([id, document]) => {
      const result: UpdateResult = await colRef.updateOne({ _id: id } as Filter<T>, { $set: document });
      return result;
    });
    const updateResults = await Promise.all(updatePromises);
    return updateResults;
  }

  // Delete

  public async deleteOneByID<T>(id: string | number): Promise<DeleteResult> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const result: DeleteResult = await colRef.deleteOne({ _id: id } as Filter<T>);
    return result;
  }

  public async deleteManyByID<T>(deletes: [string | number][]): Promise<DeleteResult[]> {
    const colRef: MongoDbCollection<T> = this.ref as unknown as MongoDbCollection<T>;
    const deletePromises = deletes.map(async (id) => {
      const result: DeleteResult = await colRef.deleteOne(id as Filter<T>);
      return result;
    });

    const deleteResults = await Promise.all(deletePromises);
    return deleteResults;
  }
}
