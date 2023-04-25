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
  public abstract async createOne<T>(_id: string | number, document: T);
  public abstract async createMany<T>(creates: [string | number, T][]);
  // Read
  public abstract async findOneById<T>(id: string | number);
  // Update
  public abstract async updateOneById<T>(id: string | number, document: T);
  public abstract async updateAllById<T>(updates: [string | number, T][]);

 // Delete

  public abstract async deleteOneByID<T> (id: string | number);
  public abstract async deleteManyByID<T> (deletes: [string | number][])
}
