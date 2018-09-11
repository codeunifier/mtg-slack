var express = require('express');
var router = express.Router();
var request = require('request');

var oauth_token = process.env.SLACK_BOT_AUTH_TOKEN;
var bot_id = 'BCQHY61GU'; //in case I ever need this

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
        console.log(e);
        if (e.type == 'message' && e.channel_type == 'im' && e.user && (e.bot_id == null || e.bot_id == undefined)) {
            console.log('Querying for: ' + e.text);
            request("https://api.magicthegathering.io/v1/cards?name=" + e.text, {json: true}, function (rErr, rRes, rBody) {
                if (rErr) {
                    console.log(rErr);
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
                        channel: e.channel,
                        text: 'Returning search for "' + e.text + '"',
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
                        token: oauth_token,
                        channel: e.channel,
                        text: 'No cards found for "' + e.text + '"'
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
                        res.send(mErr);
                        return;
                    }
                    console.log('Message sent');
                    // console.log(mRes);
                    console.log(mBody);
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