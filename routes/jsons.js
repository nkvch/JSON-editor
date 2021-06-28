const express = require('express');
const JsonsDAO = require('../dao/jsonsDAO');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.route('/')
.post(async(req, res) => {
    try {
        const Json = req.body;
        const jsonId = await JsonsDAO.saveJsonToDB(Json);
        res.status(200).json({status: 'posted', jsonId})
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

router.route('/:userId')
.get(async(req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ msg: 'Unauthorized' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userId !== req.params.userId) return res.status(401).json({ msg: 'Unauthorized' });
        
        const jsons = await JsonsDAO.listJsons(req.params.userId);
        console.log(jsons);
        res.status(200).json(jsons);
    } catch (e) {
        console.error(e);
        res.status(404).json({
            status: 'not found',
            msg: 'No jsons for this user or user does not exist',
        });
    }
})
.post(async(req, res) => {
    try {

        const token = req.headers.authorization;

        if (!token) return res.status(401).json({ msg: 'Unauthorized' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const data = req.body;
        const jsonId = await JsonsDAO.saveJsonToDB({
            ...data,
            userId: decoded.userId
        });
        res.status(200).json({msg: 'Successfully saved JSON to database', jsonId})
    } catch (e) {
        console.error(e);
        res.status(500).json({msg: 'Unable to save JSON to database'})
    }
});

router.route('/:userId/:jsonId')
.get(async (req, res) => {
    try {

        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ msg: 'Unauthorized' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId !== req.params.userId) return res.status(401).json({ msg: 'Unauthorized' });

        const Json = await JsonsDAO.getById(req.params.jsonId);
        res.status(200).json({msg: 'Successfully extracted JSON from database', json: Json});
    } catch (e) {
        console.error(e);
        res.status(404).json({status: 'not found'});
    }
})
.patch(async (req, res) => {
    try {

        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ msg: 'Unauthorized' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userId !== req.params.userId) return res.status(401).json({ msg: 'Unauthorized' });

        const data = req.body;
        await JsonsDAO.updateJSONinDB(data, req.params.jsonId);
        res.status(200).json({msg: 'Successfully updated JSON in database'});
    } catch (e) {
        console.error(e);
        res.status(500).json({msg: 'Unable to update JSON in database'});
    }
});

module.exports = router;