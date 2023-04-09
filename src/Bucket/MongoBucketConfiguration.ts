import { IMongoConfiguration } from './MongoConfiguration.interface';
import { DatabaseType } from '../type/database.enum';
import { BucketConfiguration } from './BucketConfiguration';
import { Db, MongoClient } from 'mongodb';

export class MongoBucketConfiguration extends BucketConfiguration {
  constructor(config: IMongoConfiguration) {
    super(DatabaseType.Mongo as DatabaseType, config);
  }

  protected _initialize(): MongoClient {
    const client = new MongoClient((this.config as IMongoConfiguration).uri);
    return client;
  }

  protected async _connect(client: MongoClient): Promise<Db> {
    await client.connect();
    const db: Db = client.db((this.config as IMongoConfiguration).database);
    return db
  }
}
