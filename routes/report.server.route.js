/**
 * Created by CSS on 21-09-2016.
 */

module.exports = function(app) {
    var downloadReport = require('../controllers/report.server.controller');

    app.post('/report/download',downloadReport.reportGeneration);

    app.get('/report/delete',downloadReport.deleteFile);

    app.post('/report/pdf/download',downloadReport.pdfGeneration);

};