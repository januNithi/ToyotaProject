
var storageManager = require("../config/db/jobRegistrationManager");

exports.getjobRegistration = function(req,res) {

    storageManager.jobRegistration().then(function (results) {
        res.send(results);
    });


};

exports.updateServiceRegistration=function(req,res){


    storageManager.updateJobRegistration(req.body).then(function (results) {
        res.send(results);
    });


};


exports.saveNewJobRegDeatails=function(req,res) {


    storageManager.saveNewJobRegistration(req.body).then(function (results) {
        res.send(results);
    });
};

exports.deleteJobRegDeatails=function(req,res) {


    storageManager.deleteJobRegistration(req.body).then(function (results) {
        res.send(results);
    });
};