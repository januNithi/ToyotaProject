
module.exports = function(app) {
    var userRegistration = require('../controllers/userRegistration.server.controller');
    
    app.get('/getEmployeeRegDetails',userRegistration.getEmployeeRegDetails);
    app.post('/UpdateEmployeeRegDetails',userRegistration.updateEmployeeRegDetails);
    app.post('/SaveEmployeeRegDetails',userRegistration.saveNewEmployeeRegDetails);
    app.post('/deleteEmployeeDetails',userRegistration.deleteEmployeeDetails);
   
};