/**
 * Created by CSS on 13-08-2016.
 */
var mysql = require('mysql');
var q = require('q');
var db = require('./../db');
var con = mysql.createConnection(db);

var sqlDb = require('./../sqlDb');

var sql = require('mssql');


var loadDataManager = require('./loadInputDataManager.js');

function getModels(){

    var deferred = q.defer();

    var query = "Select Distinct(MName) as MName from Toyota_Model";

    var models = [];

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.query(query).then(function (recordset,err) {

            if(err){
                connection.close();
                return deferred.reject(err);
            }

            if(recordset && recordset.length > 0) {

                var data = recordset;

                data.forEach(function (value, index) {

                    var qry = "select Mid,MType,Employee,Flag,Date from Toyota_Model where MName = '" + value.MName+"'";


                    request.query(qry).then(function (records,err) {

                        if(err){
                            connection.close();
                            return deferred.reject(err);
                        }

                        if(records && records.length > 0){
                            value.services = records;
                            value.isEdit = false;
                            models.push(value);
                            if ((index + 1) >= data.length) {
                                connection.close();
                                deferred.resolve(models);
                            }
                        }else{
                            connection.close();
                            deferred.resolve(data);
                        }

                    });

                });
            }else{
                connection.close();
                deferred.resolve(recordset);
            }

        });
    });

    return deferred.promise;

}

function deleteModel(modelId){

    var deferred = q.defer();

    if(ModelId.length) {

        connection.connect().then(function () {
            var request = new sql.Request(connection);

            modelId.forEach(function (value,index) {
                var query = "Delete from Toyota_Model where id = " + value.modelId;

                request.query(query).then(function (recordset,err) {

                    if (err) {
                        connection.close();
                        return deferred.reject(error);
                    }
                    if((index + 1) == modelId.length) {
                        connection.close();
                        deferred.resolve(request.rowsAffected);
                    }
                });
            });

        });

    }else{
        var query = "Delete from Toyota_Model where id = " + modelId;

        connection.connect().then(function () {
            var request = new sql.Request(connection);

            request.query(query).then(function (recordset,err) {

                if (err) {
                    connection.close();
                    return deferred.reject(error);
                }
                connection.close();
                deferred.resolve(request.rowsAffected);
            });

        });
    }

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

// function updateModel(model){
//
//     var deferred = q.defer();
//
//     var query ="Insert into Toyota_Model(modelName,status) values('"+model.modelName+"','active')";
//
//     con.query(query,function (error,result) {
//
//         if(error){
//             return deferred.reject(error);
//         }
//
//         deferred.resolve(result);
//
//     });
//
//     return deferred.promise;
// }

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

function updateModel(data){

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {

        data.services.forEach(function(value,index){
            if(value.Mid) {
                query = "Update Toyota_Model set MName = @MName,MType = @MType";
                query += ",Employee = @Employee,Flag = @Flag,Date = @Date where Mid = @Mid";

                var ps = new sql.PreparedStatement(connection);
                ps.input('Mid',sql.BigInt);
                ps.input('MName', sql.NVarChar);
                ps.input('MType', sql.NVarChar);
                ps.input('Employee', sql.NVarChar);
                ps.input('Flag', sql.NVarChar);
                ps.input('Date', sql.DATE);
                ps.prepare(query, function (err) {
                    // ... error checks
                    if (err) {
                        connection.close();
                        console.log("Error1---->In updateModel"+error);

                        return deferred.reject(err);
                    }
                    ps.execute({
                            Mid: value.Mid, MName: data.MName, MType: value.MType
                            , Employee: value.Employee, Flag: value.Flag, Date: new Date()
                        },
                        function (error, results) {
                            if (error) {
                                connection.close();
                                console.log("Error2---->In updateModel"+error);
                                return deferred.reject(err);
                            }
                            ps.unprepare(function (err) {
                                if (err) {
                                    console.log("Error3---->In updateModel"+err);
                                    return deferred.reject(err);
                                }

                            });
                            if((index+1) == data.services.length) {
                                connection.close();
                                deferred.resolve(ps.lastRequest.rowsAffected);
                            }
                    });
                });


            }else{

                query = "Insert into Toyota_Model(MName,MType,Employee,Flag,Date) values";
                query += "(@MName,@MType,@Employee,@Flag,@Date)";

                var ps = new sql.PreparedStatement(connection);
                ps.input('Mid',sql.BigInt);
                ps.input('MName', sql.NVarChar);
                ps.input('MType', sql.NVarChar);
                ps.input('Employee', sql.NVarChar);
                ps.input('Flag', sql.NVarChar);
                ps.input('Date', sql.DATE);
                ps.prepare(query, function (err) {
                    // ... error checks
                    if (err) {
                        connection.close();
                        console.log("Error4---->In updateModel"+err);

                        return deferred.reject(err);
                    }
                    ps.execute({
                            MName: data.MName, MType: value.MType
                            , Employee: value.Employee, Flag: value.Flag, Date: new Date()
                        },
                        function (error, results) {
                            if (error) {
                                connection.close();
                                console.log("Error5---->In updateModel"+error);
                                return deferred.reject(err);
                            }
                            ps.unprepare(function (err) {
                                if (err) {
                                    console.log("Error6---->In updateModel"+err);

                                    return deferred.reject(err);
                                }

                            });
                            if((index+1) == data.services.length) {
                                connection.close();
                                deferred.resolve(ps.lastRequest.rowsAffected);
                            }
                        });
                });

            }
        });

    }).catch(function (err) {
        connection.close();
        console.log("Error7---->In updateModel"+err);
        return deferred.reject(err);
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