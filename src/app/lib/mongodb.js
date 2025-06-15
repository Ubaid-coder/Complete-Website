// src/lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://ubaidDeveloper:786125@authentication.q1rc0yu.mongodb.net/?retryWrites=true&w=majority&appName=Authentication"
const options = {};

let client;
let clientPromise;

if (!"mongodb+srv://ubaidDeveloper:786125@authentication.q1rc0yu.mongodb.net/?retryWrites=true&w=majority&appName=Authentication"){
    throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
    // In dev, use a global variable so the value is preserved across hot reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production, it's best to not use a global variable
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
