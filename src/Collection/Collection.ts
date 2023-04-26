import { BucketConfiguration } from '../Bucket/BucketConfiguration';
import { AppCollection, AppDatabase, DatabaseType, IDatabaseConfiguration } from '../type/database.enum';

export abstract class Collection<T> {
  public type: DatabaseType;
  public config: BucketConfiguration;
  public name: string;
  public db: AppDatabase;
  public ref: AppCollection<T>;

  constructor(config: BucketConfiguration, db: AppDatabase, name: string) {
    this.type = config.type;
    this.config = config;
    this.db = db;
    this.name = name;
  }

  // CRUD
  // Create
  public abstract createOne<T>(_id: string | number, document: T): any;
  public abstract createMany<T>(creates: [string | number, T][]): any;

  // Read
  public abstract findOneById<T>(_id: string | number): any;
  public abstract findManyById<T>(finds: [string | number, T][]): any;

  // Update
  public abstract updateOneById<T>(id: string | number, document: T): any;
  public abstract updateManyById<T>(updates: [string | number, T][]): any;

  // Delete

  public abstract deleteOneByID<T>(id: string | number): any;
  public abstract deleteManyByID<T>(deletes: [string | number][]): any;
}
