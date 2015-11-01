var express = require('express');
var request = require('request');
var app = express();

function proxy() {


    app.use('/proxy', function (req, res) {
        var googleHost = "https://maps.googleapis.com/maps/api/directions";
        var service = req.query.path;
        var url = googleHost + service;

        req.query.key = "AIzaSyB9JqZXr0WsP8zPvPZ-YyG3PbAzIyKa-aQ";

        console.log(req.query);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request(url, function(error, response, body) {
            req.pipe(request(url, req.query)).pipe(res);
        });
    });
}
proxy();
app.listen(process.env.PORT || 3000);