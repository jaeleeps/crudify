import { Bucket } from './Bucket/Bucket';

export class CrudifyClient {
  private static instance: CrudifyClient;

  private defaultBucket: Bucket = new Bucket();
  private bucketMap: { [key: string]: Bucket } = {};

  private constructor() {
    this.bucketMap[''] = this.defaultBucket;
  }

  public static getInstance(): CrudifyClient {
    if (!CrudifyClient.instance) {
      CrudifyClient.instance = new CrudifyClient();
    }
    return CrudifyClient.instance;
  }
  public getDefaultBucket(): Bucket {
    return this.defaultBucket;
  }
  public setDefaultBucket(id: string): Bucket | null {
    if (!this.bucketMap.hasOwnProperty(id)) {
      throw new Error('id not in the bucketMap');
      return null;
    }
    return (this.defaultBucket = this.bucketMap[id]);
  }

  public getBucket(id: string): Bucket | null {
    return this.bucketMap.hasOwnProperty(id) ? this.bucketMap[id] : null;
  }

  public addBucket(id: string): Bucket {
    const newBucket = new Bucket();
    this.bucketMap[id] = newBucket;
    return newBucket;
  }
}
