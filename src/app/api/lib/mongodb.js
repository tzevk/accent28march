import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let client = global._mongoClient;
let clientPromise;

if (!client) {
  client = new MongoClient(uri, options);
  global._mongoClient = client;
  clientPromise = client.connect();
} else {
  clientPromise = Promise.resolve(client);
}

export default clientPromise;