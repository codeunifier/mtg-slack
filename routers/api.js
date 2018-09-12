var express = require('express');
var router = express.Router();
var request = require('request');

var oauth_token = process.env.SLACK_BOT_AUTH_TOKEN;
var bot_id = 'BCQHY61GU'; //in case I ever need this
var bot_mention_id = '<@UCRRC56ET>';

var lastMessageReceived = "";

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

var filterEvents = function (req, res, next) {
    console.log(req.body);
    console.log('filtering...');
    if (req.body.type == 'url_verification') {
        res.statusCode = 200;
        res.send(req.body.challenge);
    } else if (req.body.type == 'event_callback') {
        var e = req.body.event;
        if (e.type == 'message' && e.channel_type == 'im' && e.client_msg_id != lastMessageReceived && e.user && (e.bot_id == null || e.bot_id == undefined)) {
            lastMessageReceived = e.client_msg_id;
            req.body.searchText = e.text;
            req.body.channel = e.channel;
            next();
        } else if (e.type == 'app_mention' && e.client_msg_id != lastMessageReceived) {
            try {
                lastMessageReceived = req.body.client_msg_id;
                var message_text = req.body.text;
                message_text = message_text.split(bot_mention_id)[1];
                message_text = message_text.split("\"");
                req.body.searchText = message_text[1];
                req.body.channel = e.channel;
                next();
            } catch (e) {
                console.log('error parsing message text in app mention');
                console.log(e);
                res.sendStatus(200);
            }
        } else {
            console.log('not the right event');
            res.sendStatus(200);
        }
    } else {
        console.log('doing nothing');
        res.sendStatus(200);
    }
}

router.post('/', filterEvents, function (req, res, next) {
    console.log(req.body);

    request("https://api.magicthegathering.io/v1/cards?name=" + req.body.searchText, {json: true}, function (rErr, rRes, rBody) {
        if (rErr) {
            console.log(rErr);
            res.statusCode = 500;
            res.send(rErr);
            return;
        }

        var nameToUrl = function (name) {
            return name.split(' ').join('%20');
        }

        var postBody;
        
        if (rBody.cards.length > 0) {
            //in case I want to do more than just the first card
            // var cardAttachments = [];
            // rBody.cards.forEach(c => {
            //     cardAttachments.push({
            //         "title": c.name,
            //         //might need to change IsProductNameExact to false
            //         "title_url": "https://shop.tcgplayer.com/productcatalog/product/show?newSearch=false&ProductType=All&IsProductNameExact=true&ProductName=" + nameToUrl(c.name),
            //         "image_url": c.imageUrl
            //     });
            // });
            // postBody = {
            //     token: oauth_token,
            //     channel: e.channel,
            //     text: 'Returning search for "' + e.text + '"',
            //     attachments: JSON.stringify(cardAttachments)
            // };

            //just use the first card
            postBody = {
                token: oauth_token,
                channel: req.body.channel,
                text: 'Returning search for "' + req.body.searchText + '"',
                attachments: JSON.stringify([
                    {
                        "title": rBody.cards[0].name,
                        //might need to change IsProductNameExact to false
                        "title_link": "https://shop.tcgplayer.com/productcatalog/product/show?newSearch=false&ProductType=All&IsProductNameExact=true&ProductName=" + nameToUrl(rBody.cards[0].name),
                        "image_url": rBody.cards[0].imageUrl
                    }
                ])
            };
        } else {
            postBody = {
                token: "",//oauth_token,
                channel: req.body.channel,
                text: 'No cards found for "' + req.body.searchText + '"'
            }
        }

        var opts = {
            url: "https://slack.com/api/chat.postMessage",
            method: "POST",
            json: true,
            formData: postBody
        }

        request(opts, function (mErr, mRes, mBody) {
            if (mErr) {
                console.log(mErr);
                res.statusCode = 500;
                res.send(mErr);
                return;
            }
            console.log('Message sent');
            // console.log(mRes);
            console.log(mBody);
            res.sendStatus(200);
        });
    });
    
});

module.exports = router;