const { ObjectID } = require('mongodb');
const mongodb = require('mongodb');

let users;


class UsersDAO {

    static async injectDB(conn) {
        if (users) {
            return
        }
        try {
            const collections = await conn.db(process.env.DB_NAME).listCollections().toArray();
            const colNames = collections.map(c => c.name);
            if (!colNames.includes('users')) {
                await conn.db(process.env.DB_NAME).createCollection('users');
            }
            users = await conn.db(process.env.DB_NAME).collection('users');
        } catch (e) {
            console.error(e);
        }
    }

    //temporary
    // static async listUsers() {
    //     try {
    //         const cursor = await users.find();
    //         const allUsers = cursor.toArray();
    //         return allUsers;
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    static async addUser(userObj) {
        try {
            const dbResponse = await users.insertOne(userObj);
            console.log(dbResponse);
        } catch (e) {
            console.error(e);
        }
    }

    static async getByUsername(username) {
        try {
            const cursor = await users.find({ "username": username });
            if (await cursor.hasNext()) {
                return cursor.next();
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
        }
    }

    static async getById(userId) {
        try {
            const cursor = await users.find({ "_id": ObjectID(userId) }).project({ password: 0 });
            if (await cursor.hasNext()) {
                return cursor.next();
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = UsersDAO;