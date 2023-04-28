# Crudbox

Crudbox is a package designed to provide unified CRUD operations 
that can work on multiple NoSQL databases([MongoDB](https://www.mongodb.com/) and [Firestore](https://firebase.google.com/docs/firestore)). 
Crudbox supports [Node.js](https://nodejs.org/en/).

## Documentation

Crudbox 1.0.6 was released on April 26, 2023. You can find more details on [Github repository](https://github.com/jaeleeps/crudify).

## Contributors

Pull requests are always welcome! Please base pull requests against the `main` branch.

Please provide your MongoDB and Firebase configuration
under `__test__/env` directory with file name `testMongoDBAtlasConfig.ts` and `testFirebaseConfig.ts`
and do **not** push it to the origin.

View all 400+ [contributors](https://github.com/Automattic/mongoose/graphs/contributors).

## Installation

First install [Node.js](http://nodejs.org/). Then:

```sh
$ npm install crudbox
```


## Importing

```typescript
import {Bucket} from "crudbox/lib/src/Bucket/Bucket.js";
```


## Overview

### Initializing a Bucket

First, we need to define a Bucket, a wrapper for a single NoSQL databse, and initilize it.
Either an instance of `IMongoConfiguration` or `IFirestoreConfiguration` can be used to initialize each NoSQL database.

#### MongoDB
```typescript
const connectionURI: string = `[MongoDB connection URI]`;
// mongodb+srv://[USER/ORGANIZATION]:[PASSWORD]@[CLUSTER]/?[OPTIONS]
const mongoConfig: IMongoConfiguration = { uri: connectionURI, database: "[Database Name]" };
const mongoBucketConfig: BucketConfiguration = new MongoBucketConfiguration(mongoConfig);
const bucket: Bucket = new Bucket(mongoBucketConfig, "[Bucket Name]");
```

#### Firestore
```typescript
const config: IFirestoreConfiguration = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..."
};
const firebaseBucketConfig: BucketConfiguration = new FirestoreBucketConfiguration(config);
const bucket: Bucket = new Bucket(firebaseBucketConfig, "[Bucket Name]");
```

After creating an instance of `Bucket` using `BucketConfiguration`, the Bucket can be initilized with a method `Bucket.initialize()`.

```typescript
const db: AppDatabase = await bucket.initialize();
```

### Registering a Collection

Once the Bucket is intialized, Collection with generic type `T` can be added or registered using `Bucket.addCollection<T>(name: string)` method.
Here, Collection has the same task unit with `CollectionReference<T>` of Firestore and `Collection<T>` of MongoDB.

```typescript
const usersCollection: MongoDbCollection<IUser> = db.collection<IUser>('users');
```

### Operating CRUD
CRUD operation can be executed on a registered `Collection<T>`.

#### **C**REATE
**`createOne`**
```typescript
const newDocument: T = {...}; 
const collection: Collection<T> = bucket.addCollection<T>('[Collection Name]');
const result = await collection.createOne<T>(newDocument);
```

**`createMany`**
```typescript
const newDocument: T[] = [...]; 
const collection: Collection<T> = bucket.addCollection<T>('[Collection Name]');
const result = await collection.createMany<T>(newDocuments);
```

#### **R**READ

**`readOneById`**
```typescript 
const collection: Collection<T> = bucket.addCollection<T>('[Collection Name]');
const result = await collection.readOneById<T>(id);
```

**`readManyById`**
```typescript
const collection: Collection<T> = bucket.addCollection<T>('[Collection Name]');
const result = await collection.readManyById<T>(ids);
```

#### **U**PDATE

**`updateOneById`**
```typescript 
const collection: Collection<T> = bucket.addCollection<T>('[Collection Name]');
const result = await collection.updateOneById<T>(id, updatingDocument);
```

**`updateManyById`**
```typescript
const collection: Collection<T> = bucket.addCollection<T>('[Collection Name]');
const result = await collection.updateManyById<T>(updatingDocuments);
```

#### **D**ELETE
**`deleteOneById`**
```typescript 
const collection: Collection<T> = bucket.addCollection<T>('[Collection Name]');
const result = await collection.deleteOneById<T>(id);
```

**`deleteManyById`**
```typescript
const collection: Collection<T> = bucket.addCollection<T>('[Collection Name]');
const result = await collection.deleteManyById<T>(ids);
```
