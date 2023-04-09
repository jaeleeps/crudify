import { IMongoConfiguration } from '../Bucket/MongoConfiguration.interface';
import { IFirestoreConfiguration } from '../Bucket/FirestoreConfiguration.interface';
import { Db, MongoClient } from 'mongodb';
import firebase from 'firebase';
import App = firebase.app.App;
import { firestore } from 'firebase-admin';
import Firestore = firestore.Firestore;

export enum DatabaseType {
  Mongo = 'MONGO',
  Firestore = 'Firestore',
}

export type IDatabaseConfiguration = IMongoConfiguration | IFirestoreConfiguration;

export type AppClient = MongoClient | App;

export type AppDatabase = Db | Firestore;
