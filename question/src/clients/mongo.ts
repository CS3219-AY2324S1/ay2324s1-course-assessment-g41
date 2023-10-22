import { MongoClient, Db, Document, Collection, ObjectId, Filter, UpdateFilter, WithId, DeleteResult } from 'mongodb';

export class MongoDBClient {
  private client: MongoClient;
  private db?: Db;
  private collections: Record<string, Collection> = {};

  constructor() {
    const connectionOptions = { maxPoolSize: 10 };

    this.client = new MongoClient(process.env.MONGO ?? "mongodb://user:pass@mongodb", connectionOptions);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(process.env.MONGO_DBNAME);
    } catch (error) {
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  getCollection(collectionName: string): Collection {
    if (!this.db) {
      throw new Error('Database connection not established');
    }

    if (!this.collections[collectionName]) {
      this.collections[collectionName] = this.db.collection(collectionName);
    }

    return this.collections[collectionName];
  }

  async findOne(collectionName: string, filter: Filter<Document>):  Promise<Document | null> {
    const collection = this.getCollection(collectionName);
    return collection.findOne(filter)
  }

  async find(collectionName: string, filter: Filter<Document>): Promise<Document[]> {
    // TODO: Native sort 
    const collection = this.getCollection(collectionName);
    return collection.find(filter).toArray();
  }

  async insertOne(collectionName: string, document: Document): Promise<Document> {
    const collection = this.getCollection(collectionName);
    return collection.insertOne(document);
  }

  async updateOne(collectionName: string, filter: Filter<Document>,
    update: UpdateFilter<Document>
  ): Promise<Document | null> {
    const collection = this.getCollection(collectionName);
    const result = await collection.updateOne(filter, { $set: update });

    if (result.modifiedCount === 0) return null;

    return this.findOne(collectionName, filter);
  }

  async deleteOne(collectionName: string, filter: Filter<Document>): Promise<DeleteResult> {
    const collection = this.getCollection(collectionName);
    return collection.deleteOne(filter);
  }
}
