import { BucketConfiguration } from './BucketConfiguration';
import { AppDatabase, DatabaseType } from '../type/database.enum';
import { Collection } from '../Collection/Collection';
import { MongoCollection } from '../Collection/MongoCollection';
import { FirestoreCollection } from '../Collection/FirestoreCollection';

export class Bucket {
  get db(): AppDatabase {
    return this._db;
  }

  set db(value: AppDatabase) {
    this._db = value;
  }
  get type(): DatabaseType {
    return this._type;
  }
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }
  get config(): BucketConfiguration {
    return this._config;
  }

  set config(value: BucketConfiguration) {
    this._config = value;
  }
  private _id: string;
  private _config: BucketConfiguration;

  private _type: DatabaseType;

  private _collectionsMap: { [key: string]: Collection<any> };
  private _db: AppDatabase;
  public constructor(config: BucketConfiguration, id: string) {
    this._id = id;
    this._type = config.type;
    this._config = config;
    this._collectionsMap = {};
  }

  public async initialize(): Promise<AppDatabase> {
    const db: AppDatabase = await this._config.initializae();
    this.db = db;
    return db;
  }

  public addCollection<T>(name: string): null | Collection<T> {
    let newCollection: Collection<T>;
    if (this.type === DatabaseType.Mongo) {
      newCollection = new MongoCollection<T>(this.config, this.db, name);
    } else if (this.type === DatabaseType.Firestore) {
      newCollection = new FirestoreCollection<T>(this.config, this.db, name);
    }
    return newCollection;
  }
}
