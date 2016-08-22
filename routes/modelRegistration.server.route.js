/**
 * Created by CSS on 13-08-2016.
 */

module.exports = function(app) {
    var modelService = require('../controllers/modelRegistration.server.controller');
    app.get('/model/getModel',modelService.getModel);
    app.post('/model/removeModel',modelService.deleteModel);
    app.post('/model/postModel',modelService.updateModel);
    app.post('/registerService',modelService.registerService);
    app.get('/getServiceId',modelService.getServiceId);
    app.post('/taskCompleted',modelService.updateTask);
};