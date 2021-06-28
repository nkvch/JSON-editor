const express = require('express');
const bcrypt = require('bcryptjs');
const UsersDAO = require('../dao/usersDAO');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

// router.get('/', async (req, res) => {
//     try {
//         const users = await UsersDAO.listUsers();
//         res.status(200).json(users);
//     } catch (e) {
//         console.error(e);
//         res.status(404).json({status: 'not found'});
//     }
// })


//get user with token in headers
router.route('/')
.get(async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ msg: 'Unauthorized' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UsersDAO.getById(decoded.userId);
        if (!user) return res.status(404).json({status: 'not found'});
        
        jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: 86400 },
            (err, token) => {
                if (err) { throw err; }
                res.status(200).json({
                    msg: 'Authorized successfully',
                    token,
                    user: user
                })
            }
        );

    } catch (e) {
        console.error(e);
        res.status(400).json({status: 'bad request', errorMsg: e});
    }
})
.post(async (req, res) => {
    try {
        const user = req.body;
        console.log(user);
        UserModel.isUser(user); //this will throw error if invalid data

        // creating salt and hash
        bcrypt.genSalt(10, async(err, salt) => {
            if (err) throw err;
            bcrypt.hash(user.password, salt, async(err, hash) => {
                if (err) throw err;
                user.password = hash;
                await UsersDAO.addUser(user);
                res.status(200).json({msg: 'User is created successfully'});
            })

        })  
    } catch (e) {
        console.error(e);
        res.status(400).json({status: 'unposted'})
    }
})




router.route('/:username')
.get(async (req, res) => {
    try {
        const username = req.params.username;
        const user = await UsersDAO.getByUsername(username);
        console.log(user);
        if (!user) {
            res.status(200).json({userExists: false});
        } else {
            res.status(200).json({userExists: true});
        }
    } catch (e) {
        console.error(e);
        res.status(400).json({status: 'bad request'});
    }
})
.post(async (req, res) => {
    try {
        const username = req.params.username;
        const user = await UsersDAO.getByUsername(username);
        if (!user) {
            return res.status(404).json({msg: 'User does not exist'});
        }

        const matches = await bcrypt.compare(req.body.password, user.password);
        if (!matches) return res.status(401).json({ msg: 'Incorrect password' });

        const { password, ...userData } = user;

        jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: 86400 },
            (err, token) => {
                if (err) { throw err; }
                res.status(200).json({
                    msg: 'Logged in successfully',
                    token,
                    user: userData
                })
            }
        );

    } catch (e) {
        console.error(e);
        res.status(400).json({status: 'bad request', errorMsg: e});
    }
});

module.exports = router;