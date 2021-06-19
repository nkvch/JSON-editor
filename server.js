//import express from 'express';
const express = require('express');
//import cors from 'cors';
const cors = require('cors');
//import jsons from './routes/postJson.js';
const jsons = require('./routes/postJson');
//import path from 'path';
const path = require('path');
//import dotenv from 'dotenv';
const dotenv = require('dotenv');
//import mongodb from 'mongodb';
const mongodb = require('mongodb');
const JsonsDAO = require('./dao/jsonsDAO');
//const path = require('path');

dotenv.config();

const port = 8080;

const DB_ACCESS_STRING = "mongodb+srv://stasok:abcd1234@cluster0.hgwuq.mongodb.net/?retryWrites=true&w=majority";

const MongoClient = mongodb.MongoClient(DB_ACCESS_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const app = express();

app.use(express.json());
app.use(cors());
app.use('/jsons', jsons);

app.use(express.static(path.join('build')));
    
app.get('*', (req, res) => {
    console.log('running production commands');   
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build'));
    
//     app.get('*', (req, res) => {
//         console.log('running production commands');   
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });
// }

MongoClient.connect()
.catch((e) => {
    console.error(e);
})
.then(async(conn) => {
    await JsonsDAO.injectDB(conn);
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
});



