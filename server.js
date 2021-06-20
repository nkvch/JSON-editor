const express = require('express');
const cors = require('cors');
const jsons = require('./routes/postJson');
const path = require('path');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
const JsonsDAO = require('./dao/jsonsDAO');

dotenv.config();

const port = 8080;

const MongoClient = mongodb.MongoClient("mongodb+srv://stasok:abcd1234@cluster0.hgwuq.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use(cors());
app.use('/jsons', jsons);

// app.use(express.static('client/build'));
    
// app.get('/*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// });

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    
    app.get('*', (req, res) => {  
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

MongoClient.connect()
.catch((e) => {
    console.error(e);
})
.then(async(conn) => {
    await JsonsDAO.injectDB(conn);
    app.listen(process.env.PORT || port, () => {
        console.log(`listening on port ${process.env.PORT}`);
    });
});



