const mongodb = require('mongodb');

let jsons;
const DB_NAME = "jsonDB";

class JsonsDAO {

    static async injectDB(conn) {
        if (jsons) {
            return
        }
        try {
            jsons = await conn.db(DB_NAME).collection('jsons');
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

}

module.exports = JsonsDAO;