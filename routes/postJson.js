const express = require('express');
const JsonsDAO = require('../dao/jsonsDAO');

const router = express.Router();

router.route('/')
.post(async(req, res) => {
    try {
        const Json = req.body;
        await JsonsDAO.saveJsonToDB(Json);
        res.status(200).json({status: 'posted'})
    } catch (e) {
        console.error(e);
        res.status(500).json({status: 'unposted'})
    }
    
});


module.exports = router;