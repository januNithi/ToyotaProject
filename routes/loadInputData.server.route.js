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
};