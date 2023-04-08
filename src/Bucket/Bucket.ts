import { BucketConfiguration } from './BucketConfiguration';
import { AppClient } from '../type/database.enum';

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
  private constructor(config: BucketConfiguration) {
    this._config = config;
  }

  public async initialize(): Promise<AppClient> {
    const appClient: AppClient = await this._config.initializae();
    return appClient;
  }



}
