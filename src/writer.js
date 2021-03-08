const fs = require('fs');
const path = require('path');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connect = (options) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(`mongodb://${options.username}:${options.password}@${options.host}:${options.port}?authMechanism=SCRAM-SHA-256&authSource=admin`, (err, db) => {
            if (err) {
                reject(err);
            }

            resolve(db);
        });
    });
};

/**
 * ソースコードを書き込む
 * */
exports.writeSourceCode = async (options, submission) => {
    const client = await connect(options);
    const db = client.db(options.db);
    const collection = db.collection('originals');
    
    await collection.insertOne(submission);
    await client.close();
};
