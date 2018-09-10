var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/search', function (req, res, next) {
    console.log(req.query);
    request("https://api.magicthegathering.io/v1/cards?name=" + req.query.q, {json: true}, function (rErr, rRes, rBody) {
        if (rErr) {
            res.send(rErr);
            return;
        }
        res.send(rBody.cards);
    });
});

module.exports = router;