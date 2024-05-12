// import { MongoClient } from "mongodb";
const {MongoClient} = require('mongodb');

const connection = new MongoClient(process.env.DB_URL);

let client; 

// Function to connect to MongoDB
async function connectToMongoDB(cb) {
    try {
        // Connect the client to the MongoDB server
        client  = await connection.connect();
        console.log('Connected to MongoDB');
        cb();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

function getClient() {
    if(client){
        return client;
    }else {
        return null;
    }
}

// Call the function to connect to MongoDB when this module is imported
module.exports = {connectToMongoDB, getClient};