var express = require('express');
var app = express();
var db = require('./DBData.js');


app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    console.log(req.query);
//    res.send('Try to parse request');
//    res.status(200).json(db.getUsers(req.query.count, req.query.page));
    db.getUsers(res, +req.query.count, +req.query.page);
});

app.get('/userscount', (req, res) => {
    console.log(req.query);
//    res.send('Try to parse request');
//    res.status(200).json(db.getUsers(req.query.count, req.query.page));
    db.getUsersCount(res);
});

app.get('/user/:id', function (req, res) {
    db.getUserStatistic(res, +req.params.id, +req.query.timeFrom, +req.query.timeTo);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    db.checkTables();
});