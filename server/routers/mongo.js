var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const UserSchema = require('../models/user');
const BoardSchema = require('../models/board');

mongoose.connect(process.env.MONGOLAB_URI_MTG, {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection-error'));
db.once('open', function () {
    console.log('Connected to mongo lab.');
});

router.get('/', function (req, res, next) {
    next();
});

router.get('/user', function (req, res, next) {
    res.send('data');
});

router.post('/login', function (req, res, next) {
    var reqUser = req.body;

    UserSchema.findOne({ username: reqUser.email }, function (err, user) {
        if (err) throw err;

        user.comparePassword(reqUser.password, function (err, isMatch) {
            if (err) throw err;

            if (isMatch) {
                var token = user.generateJwt();

                res.send({ valid: true, token: token });
            } else {
                res.send({ valid: false });
            }
        });
    });
});

router.post('/register', function (req, res, next) {
    var user = req.body;

    //TODO: add a check to see if the email is already registered
    var userSchema = new UserSchema({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.email,
        password: user.password,
        creation_date: Date.now(),
        admin: false
    });

    userSchema.save(function (err, doc, rows) {
        if (err) {
            res.send(false);
            throw err;
        }
        
        res.send(true);
    });
});

module.exports = router;