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
                    console.log(rErr);
                    res.send(rErr);
                    return;
                }

                var postBody = {
                    token: req.body.token,
                    channel: e.channel,
                    text: 'Returning search for "' + e.text + "'",
                    attachments: [
                        {
                            "pretext": rBody.cards[0].name,
                            "image_url": rBody.cards[0].image_url
                        }
                    ]
                }

                request("https://slack.com/api/chat.postMessage", postBody, function (mErr, mRes, mBody) {
                    if (mErr) {
                        console.log(mErr);
                        res.send(mErr);
                        return;
                    }
                    console.log('Message sent');
                    res.send(200);
                });
            });
        } else {
            res.send(202); //Accepted
        }
    } else {
        res.send(202); //Accepted
    }
});

module.exports = router;