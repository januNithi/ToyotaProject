/**
 * Created by CSS on 13-08-2016.
 */

var storageManager = require("../config/db/ModeServiceManager");

exports.getModel = function(req,res) {
    
    storageManager.getModels().then(function (results) {
        res.send(results);
    },function (error) {
        res.send(500,{ error: error });
    });
    
};

exports.updateModel = function (req,res) {
  
    // storageManager.updateModelAndServices(req.body).then(function (results) {
    //     res.send(results);
    // },function (error) {
    //     res.send(500,{ error: error });
    // });
    storageManager.updateModel(req.body).then(function (results) {
        res.send(results);
    },function (error) {
        res.send(500,{ error: error });
    });

};

exports.registerService = function(req,res){

    storageManager.updateRegistration(req.body).then(function (results) {
        res.send(results);
    },function (error) {
       res.send(500,{error:error});
    });

};

exports.getServiceId = function (req,res) {

    if(req.session.data && req.session.data.serviceId){
        res.send(req.session.data);
    }else{
        var data = {
            serviceId : 0
        }
        res.send(data);
    }

};

exports.updateTask = function (req,res) {

    storageManager.updateTaskCompleted(req.body).then(function (results) {

        res.send(results);

    },function (error) {

        res.send(500,{error:error});

    });

};

exports.deleteModel = function (req,res) {

    storageManager.deleteServices(req.body.id).then(function (results) {
        storageManager.deleteModel(req.body).then(function(results){
            storageManager.getModels().then(function(results){
                res.send(results);
            });
        });
    },function (error) {
        res.send(500,{ error: error });
    });
};