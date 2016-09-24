/**
 * Created by CSS on 26-07-2016.
 */

module.exports = function(app) {
    var loadInput = require('../controllers/loadInputData.server.controller');
    app.post('/connect/loadData',loadInput.loadInputData);
    app.get('/connect/getData',loadInput.getInputData);
    app.post('/uploadImage',loadInput.uploadImages);
    app.post('/connect/updateData',loadInput.updateInstructions);
    app.get('/connect/getInstruction',loadInput.getInstruction);
    
    app.post('/deleteEntireInstruction',loadInput.deleteEntireInstruction);
    app.post('/deleteSingleInstruction',loadInput.deleteSingleInstruction);
    
    app.get('/connect/getAdditional',loadInput.getAdditionalData);
    app.post('/connect/deleteAdditional',loadInput.deleteAdditionals);
    app.post('/connect/updateAdditional',loadInput.updateAdditionals);


    app.get('/connect/getWorkCompleted',loadInput.getWorkCompleted);


    app.get('/connect/getMeasures',loadInput.getMeasures);
    app.post('/connect/deleteMeasure',loadInput.deleteMeasure);
    app.post('/connect/updateMeasure',loadInput.updateMeasure);

    
    app.get('/connect/getRegisteredService',loadInput.getRegisteredService);

};