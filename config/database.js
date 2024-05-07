import { MongoClient } from "mongodb";

const uri = process.env.DB_URL;
export const client = new MongoClient(uri);