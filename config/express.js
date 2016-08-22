/**
 * Created by CSS on 26-07-2016.
 */

var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    path=require('path'),
    passport = require('passport');


module.exports = function() {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    // app.use(methodOverride());

    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', 'http://localhost');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    var store = new session.MemoryStore();

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }));


    app.use(passport.initialize());
    app.use(passport.session());
        
    app.use(session({ secret: 'something', store: store }));

    app.use(express.static('./public'));

    require('../routes/loadInputData.server.route')(app);
    require('../routes/modelRegistration.server.route')(app);

    require('../routes/layout.server.route')(app);	//Layout page route

    return app;
};