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
  public abstract async insertOne<T>(_id: string | number, document: T);
  // Read
  public abstract async findOneById<T>(id: string | number);
  // Update
  public abstract async updateOne<T> (_id: string | number, document: T);
  public abstract async updateAll<T> (updates: [string | number, T][]);

  // Delete

}
