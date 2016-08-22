/**
 * Created by CSS on 13-08-2016.
 */
var mysql = require('mysql');
var q = require('q');
var db = require('./../db');
var con = mysql.createConnection(db);

var loadDataManager = require('./loadInputDataManager.js');

function getModels(){
    var deferred = q.defer();

    var query = "Select modelName,id from model where status = 'active'";

    var models = [];

    con.query(query,function (error,results) {

        if(error){
            return deferred.reject(error);
        }

        if(results && results.length > 0){

            var data = results;

            data.forEach(function(value, index) {

                var qry = "select service as serviceName,id as serviceId from service_type where modelId = "+value.id;
                qry += " and status = 'active'";

                con.query(qry,function (err,rslt) {

                    if(err){
                        return deferred.reject(err);
                    }
                    value.services = rslt;
                    value.isEdit = false;
                    models.push(value);
                    if((index + 1) >= data.length){
                        deferred.resolve(models);
                    }
                });

            });

        }

    });

    return deferred.promise;

}

function deleteModel(model){

    var deferred = q.defer();

    var query = "Update model set status = 'mark as deleted' where id = "+model.id;

    con.query(query,function (error,result) {

        if(error){
            return deferred.reject(error);
        }

        deferred.resolve(result);

    });

    return deferred.promise;

}

function updateTaskCompleted(data){
    var deferred = q.defer();

    var query = "";

    if(data.flag = 'I'){
        query = "Update serviceregistration set IFlag = "+data.taskNumber+" where id = "+ data.orderRegId+";"
    }else if(data.flag = 'R'){
        query = "Update serviceregistration set RFlag = "+data.taskNumber+" where id = "+ data.orderRegId+";"
    }else if(data.flag = 'L'){
        query = "Update serviceregistration set LFlag = "+data.taskNumber+" where id = "+ data.orderRegId+";"
    }

    con.query(query,function(error,result){

        if(error){
            return deferred.reject(error);
        }

        if(result){

            if(data.flag = 'I'){
                query = "Update serviceworkcheck set flag_i = 1 where taskId_i = "+data.taskNumber+" and orderRegId = "+ data.orderRegId+";"
            }else if(data.flag = 'R'){
                query = "Update serviceworkcheck set flag_r = 1 where taskId_r = "+data.taskNumber+" and orderRegId = "+ data.orderRegId+";"
            }else if(data.flag = 'L'){
                query = "Update serviceworkcheck set flag_l = 1 where taskId_l = "+data.taskNumber+" and orderRegId = "+ data.orderRegId+";"
            }

            con.query(query, function (err, rslt) {

                if(err){
                    return deferred.reject(err);
                }

                deferred.resolve(rslt);
            });

        }
    });
    return deferred.promise;
}

function deleteServices(modelId){
    var deferred = q.defer();

        var qry = "Update service_type set status = 'mark as deleted' where modelId = " + modelId;

        con.query(qry, function (err, rslt) {

            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(rslt);
        });

    return deferred.promise;
}

function updateModel(model){

    var deferred = q.defer();

    var query ="Insert into model(modelName,status) values('"+model.modelName+"','active')";

    con.query(query,function (error,result) {

        if(error){
            return deferred.reject(error);
        }

        deferred.resolve(result);

    });

    return deferred.promise;
}

function updateRegistration(data){

    var deferred = q.defer();

    var query ="Insert into serviceregistration(orderNum,serviceId,mileage,vehicleNo,RFlag,";
    query += "LFLag,IFlag) values('"+data.orderNumber+"','"+data.serviceId+"','"+data.mileage+"','";
    query += data.vehicleNumber+"',0,0,0)";

    con.query(query, function (error,result) {

        if(error){
            return deferred.reject(error);
        }

        if(result) {

            loadDataManager.getInstructionData(data).then(function (rsl) {
                loadDataManager.updateWorkCheckInstructions(rsl, result.insertId).then(function (r) {
                    deferred.resolve(result.insertId);
                },function (e) {
                    return deferred.reject(e);
                });
            },function (err) {
                return deferred.reject(err);
            });
        }

    });

    return deferred.promise;

}

function updateModelAndServices(model){

    var deferred = q.defer();
   if(model.id){
       deleteModel(model).then(function(result){
           deleteServices(model.id).then(function(result){
               updateModel(model).then(function (result) {
                   updateServices(model.services,result.insertId).then(function (result) {
                       getModels().then(function (result) {
                           deferred.resolve(result);
                       },function (erro) {
                           return deferred.reject(erro);
                       });
                   },function (er) {
                       return deferred.reject(er);
                   });
               },function (e) {
                   return deferred.reject(e);
               });
           },function (err) {
               return deferred.reject(err);
           });
       },function (error) {
           return deferred.reject(error);
       });
   }else{
       updateModel(model).then(function(result){
           updateServices(model.services,result.insertId).then(function (result) {
               getModels().then(function (result) {
                   deferred.resolve(result);
               },function (e) {
                   return deferred.reject(e);
               });
           },function (err) {
               return deferred.reject(err);
           });
       },function (error) {
           return deferred.reject(error);
       });
   }
    return deferred.promise;
}


function updateServices(services,modelId) {
    var deferred = q.defer();

    services.forEach(function (value, index) {

        var qry = "Insert into service_type(modelId,service,status) values(" + modelId;
        qry += ",'" + value.serviceName + "','active')";

        con.query(qry, function (err, rslt) {

            if (err) {
                return deferred.reject(err);
            }
            if ((index + 1) >= services.length) {
                deferred.resolve(rslt);
            }
        });
    });

    return deferred.promise;
}

module.exports={
    getModels:getModels,
    updateModel:updateModel,
    deleteModel:deleteModel,
    deleteServices:deleteServices,
    updateServices:updateServices,
    updateModelAndServices:updateModelAndServices,
    updateRegistration:updateRegistration,
    updateTaskCompleted:updateTaskCompleted
};