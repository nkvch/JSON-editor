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
            // conn.db(process.env.DB_NAME).createCollection('jsonsYOPTA', async(e, coll) => {
            //     jsons = await conn.db(process.env.DB_NAME).collection('jsonsYOPTA');
            // })
        } catch (e) {
            console.error(e);
        }
    }

    static async saveJsonToDB(obj) {
        try {
            const dbResponse = await jsons.insertOne(obj);
            console.log(dbResponse);
            return dbResponse.insertedId;
        } catch (e) {
            console.error(e);
        }
    }

    static async updateJSONinDB(data, _id) {
        try {
            const updateDoc = {
                $set: {
                    "JSONobject": data.JSONobject,
                    "name": data.name
                }
            };
            const dbResponse = await jsons.updateOne({
                "_id": ObjectID(_id)
            }, updateDoc);
            console.log(dbResponse);
        } catch (e) {
            console.error(e);
        }
    }

    static async listJsons(forUserId) {
        try {
            const cursor = await jsons.find(
                forUserId
                && {
                    "userId": forUserId
                }
            ).project({ JSONobject: 0 , userId: 0});
            const allJsons = cursor.toArray();
            return allJsons;
        } catch (e) {
            console.error(e);
        }
    }

    static async getById(_id) {
        try {
            const cursor = await jsons.find({"_id": ObjectID(_id)}).project({ userId: 0 });
            const gotJson = await cursor.next();
            return gotJson;
        } catch (e) {
            console.error(e);
        }
    }

}

module.exports = JsonsDAO;