import { BucketConfiguration } from './BucketConfiguration';
import { AppClient, AppDatabase } from '../type/database.enum';
import { Collection } from '../Collection/Collection';

export class Bucket {
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

  private _collectionsMap: { [key: string]: Collection<any> };
  private constructor(config: BucketConfiguration) {
    this._config = config;
    this._collectionsMap = {};
  }

  public async initialize(): Promise<AppDatabase> {
    const appClient: AppDatabase = await this._config.initializae();
    return appClient;
  }
}
