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
    
})
.get(async(req, res) => {
    try {
        const jsons = await JsonsDAO.listJsons();
        res.status(200).json(jsons);
    } catch (e) {
        console.error(e);
        res.status(404).json({status: 'not found'});
    }
});

router.route('/:jsonId')
.get(async (req, res) => {
    try {
        const Json = await JsonsDAO.getById(req.params.jsonId);
        res.status(200).json(Json);
    } catch (e) {
        console.error(e);
        res.status(404).json({status: 'not found'});
    }
})
.patch(async (req, res) => {
    try {
        const Json = req.body;
        await JsonsDAO.updateJSONinDB(Json, req.params.jsonId);
        res.status(200).json({status: 'updated'})
    } catch (e) {
        console.error(e);
        res.status(500).json({status: 'not updated'})
    }
});

module.exports = router;