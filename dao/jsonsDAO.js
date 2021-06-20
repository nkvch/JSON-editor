const { ObjectID } = require('mongodb');
const mongodb = require('mongodb');

let jsons;

class JsonsDAO {

    static async injectDB(conn) {
        if (jsons) {
            return
        }
        try {
            jsons = await conn.db(process.env.DB_NAME).collection('jsons');
        } catch (e) {
            console.error(e);
        }
    }

    static async saveJsonToDB(obj) {
        try {
            const dbResponse = await jsons.insertOne(obj);
            console.log(dbResponse);
        } catch (e) {
            console.error(e);
        }
    }

    static async updateJSONinDB(obj, _id) {
        try {
            const dbResponse = await jsons.replaceOne({
                "_id": ObjectID(_id) 
            }, obj);
            console.log(dbResponse);
        } catch (e) {
            console.error(e);
        }
    }

    static async listJsons() {
        try {
            const cursor = await jsons.find().project({name: 1});
            const allJsons = cursor.toArray();
            return allJsons;
        } catch (e) {
            console.error(e);
        }
    }

    static async getById(_id) {
        try {
            const cursor = await jsons.find({"_id": ObjectID(_id)});
            const gotJson = await cursor.next();
            return gotJson;
        } catch (e) {
            console.error(e);
        }
    }

}

module.exports = JsonsDAO;