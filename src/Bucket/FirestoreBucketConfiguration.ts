import { IFirestoreConfiguration } from './FirestoreConfiguration.interface';
import { DatabaseType } from '../type/database.enum';
import { BucketConfiguration } from './BucketConfiguration';
import { IMongoConfiguration } from './MongoConfiguration.interface';
import firebase from 'firebase';
import initializeApp = firebase.initializeApp;
import App = firebase.app.App;

export class FirestoreBucketConfiguration extends BucketConfiguration {
  constructor(config: IFirestoreConfiguration) {
    super(DatabaseType.Firestore as DatabaseType, config);
  }

  protected _initialize(): App {
    const app: App = initializeApp(this.config);
    return app;
  }

  protected _connect(app: App): App {
    return app
  }

}
