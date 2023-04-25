import { IMongoConfiguration } from '../Bucket/MongoConfiguration.interface';
import { IFirestoreConfiguration } from '../Bucket/FirestoreConfiguration.interface';
import { Collection, Db, MongoClient } from 'mongodb';
import firebase from 'firebase';
import App = firebase.app.App;
import { firestore } from 'firebase-admin';
import Firestore = firestore.Firestore;
import { CollectionReference } from '@google-cloud/firestore';
import { Document } from 'bson';

export enum DatabaseType {
  Mongo = 'MONGO',
  Firestore = 'Firestore',
}

export type IDatabaseConfiguration = IMongoConfiguration | IFirestoreConfiguration;

export type AppClient = MongoClient | App;

export type AppDatabase = Db | any;

export type AppCollection<T> = Collection<T> | CollectionReference<T>;

export type MongoDbCollection<T> = Collection<T>;
