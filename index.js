const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4040;

var apiRouter = require('./routers/api');

app.use(session({
    secret: "planechat",
    cookie: {
        httpOnly: true,
        maxAge: 60000,
        name: "sessionId",
        secure: true
    },
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res, next) {
    res.send('Hello world');
});

app.use('/api', apiRouter);

app.listen(port, () => console.log('Listening on port ' + port));