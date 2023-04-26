import { IFirestoreConfiguration } from './FirestoreConfiguration.interface';
import { AppClient, DatabaseType } from '../type/database.enum';
import { BucketConfiguration } from './BucketConfiguration';
import { IMongoConfiguration } from './MongoConfiguration.interface';
import firebase from 'firebase';
import initializeApp = firebase.initializeApp;
import App = firebase.app.App;
import { firestore } from 'firebase-admin';
import Firestore = firestore.Firestore;

export class FirestoreBucketConfiguration extends BucketConfiguration {
  constructor(config: IFirestoreConfiguration) {
    super(DatabaseType.Firestore as DatabaseType, config);
  }

  protected _initialize(): App {
    if (!firebase.apps.length) {
      return initializeApp(this.config) as App;
    } else {
      return firebase.apps[0] as App;
    }
  }

  protected async _connect(app: AppClient): Promise<any> {
    const db = (app as App).firestore();
    return new Promise<any>((resolve) => {
      resolve(db);
    });
  }
}
