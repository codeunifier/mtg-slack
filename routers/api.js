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

router.post('/', function (req, res, next) {
    if (req.body.type == 'url_verification') {
        res.send(req.body.challenge);
    } else if (req.body.type == 'event_callback') {
        var e = req.body.event;
        if (e.type == 'message' && e.channel_type == 'im') {
            console.log('Querying for: ' + e.text);
            request("https://api.magicthegathering.io/v1/cards?name=" + e.text, {json: true}, function (rErr, rRes, rBody) {
                if (rErr) {
                    res.send(rErr);
                    return;
                }
                console.log(rBody.cards);
                res.send(200);
            });
        } else {
            res.send(202); //Accepted
        }
    } else {
        res.send(202); //Accepted
    }
});

module.exports = router;