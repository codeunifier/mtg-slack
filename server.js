const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

var apiRouter = require('./server/routers/api');
var mongoRouter = require('./server/routers/mongo');

app.use(session({
    secret: "slackity",
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

app.use('/api', apiRouter);
app.use('/mongo', mongoRouter);

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => console.log('Listening on port ' + port));