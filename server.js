/**
 * Created by CSS on 26-07-2016.
 */
var express = require('./config/express');

var app = express();

var server = app.listen(3000, function () {
    var port = server.address().port;

    console.log('Server running at %s', port);
});