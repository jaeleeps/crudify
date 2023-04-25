import { BucketConfiguration } from '../Bucket/BucketConfiguration';
import { Collection } from './Collection';
import {Db, FindCursor, InsertOneResult, UpdateResult, WithId} from 'mongodb';
import { CollectionReference } from '@google-cloud/firestore';
import { MongoDbCollection } from '../type/database.enum';
import {IUser} from "../../__test__/Test.interface";

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
  public async findOneById<T>(_id: string | number, document: T) {
    const colRef: MongoDbCollection<T> = this.ref as MongoDbCollection<T>;
    const id: string = typeof _id === 'string' ? _id: _id.toString();
    const result = await colRef.findOne({ id: id });
    return result;
  }

  public async findManyById<T>(finds: [string | number, T][]) {
    const colRef: MongoDbCollection<T> = this.ref as MongoDbCollection<T>;
    // console.log(finds);
    // let ret = [];
    // finds.forEach(async id => {
    //   const result = await colRef.findOne({ id: id });
    //   console.log(result);
    //   console.log(id);
    //   ret.push(result);
    // });
    // return ret;
    const findPromises = finds.map(([id]) => {
      const docId: string = typeof id === 'string' ? id : id.toString();
      return colRef.findOne({ id: id});
    });

    const findResults = await Promise.all(findPromises);
    return findResults;
  }

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
}
