import { IMongoConfiguration } from './MongoConfiguration.interface';
import { AppClient, AppDatabase, DatabaseType, IDatabaseConfiguration } from '../type/database.enum';
import { MongoClient } from 'mongodb';
import firebase from 'firebase';
import App = firebase.app.App;

export abstract class BucketConfiguration {
  public type: DatabaseType;
  public config: IDatabaseConfiguration;

  constructor(type: DatabaseType, config: IDatabaseConfiguration) {
    this.type = type;
    this.config = config;
  }

  protected abstract _initialize(): AppClient;
  protected abstract async _connect(app: AppClient): AppDatabase;
  public async initializae(): Promise<AppClient> {
    const appClient: AppClient = this._initialize();
    const connectedAppClient: AppClient = this._connect(appClient);
    return connectedAppClient;
  }

}
