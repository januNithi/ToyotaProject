/**
 * Created by CSS on 26-07-2016.
 */
module.exports = function(app) {
    var main = require('../controllers/layout.server.controller.js');	//Layout page controllers

    app.get('*', main.layout);
};