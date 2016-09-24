
module.exports = function(app) {
    var jobRegistration = require('../controllers/jobRegistration.server.controller');

    app.get('/getJobRegistration',jobRegistration.getjobRegistration);
    app.post('/postServiceRegistration',jobRegistration.updateServiceRegistration);
    app.post('/saveNewJobService',jobRegistration.saveNewJobRegDeatails);
    app.post('/deleteJobService',jobRegistration.deleteJobRegDeatails);

};