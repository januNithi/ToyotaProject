/**
 * Created by CSS on 22-08-2016.
 */

module.exports = function(app) {
    var javaService = require('../controllers/java.server.controller');
    app.get('/getExcelImages',javaService.getImages);
};