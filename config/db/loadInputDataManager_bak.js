/**
 * Created by CSS on 19-08-2016.
 */
var mysql = require('mysql');
var q = require('q');
var db = require('./../db');

var fs = require('fs');
var con = mysql.createConnection(db);
//
// function updateInstructionData(data) {
//     var deferred = q.defer();
//
//     var k = 1;
//
//     for(var i = 4 ; i < data.length; i++) {
//         var dataUpdate = 'Insert into tasks(serviceId,taskId,userModeId,task,';
//         dataUpdate += 'process,picture,measurement,timeTaken,tools,inference,version)';
//         dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?)';
//         console.log('Query template' + dataUpdate);
//         var query = mysql.format(dataUpdate, [1, k, 1, data[i][2], data[i][3], data[i][6], data[i][4]
//             , 20, data[i][5], data[i][7], 1]);
//         console.log(query);
//         con.query(query, function (error, results) {
//             if (error) {
//                 console.error(error);
//                 return deferred.reject(error);
//             }
//         });
//         k++
//     }
//
//     k=1;
//
//     for(var i = 4 ; i < data.length; i++) {
//         var dataUpdate = 'Insert into tasks(serviceId,taskId,userModeId,task,';
//         dataUpdate += 'process,picture,measurement,timeTaken,tools,inference,version)';
//         dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?)';
//         console.log('Query template' + dataUpdate);
//         var query = mysql.format(dataUpdate, [1, k, 2, data[i][18], data[i][19], data[i][22], data[i][20]
//             , 20, data[i][21], data[i][23], 1]);
//         console.log(query);
//         con.query(query, function (error, results) {
//             if (error) {
//                 console.error(error);
//                 return deferred.reject(error);
//             }
//         });
//         k++
//     }
//
//     k=1;
//
//     for(var i = 4 ; i < data.length; i++) {
//         var dataUpdate = 'Insert into tasks(serviceId,taskId,userModeId,task,';
//         dataUpdate += 'process,picture,measurement,timeTaken,tools,inference,version)';
//         dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?)';
//         console.log('Query template' + dataUpdate);
//         var query = mysql.format(dataUpdate, [1, k, 3, data[i][10], data[i][11], data[i][14], data[i][12]
//             , 20, data[i][13], data[i][15], 1]);
//         console.log(query);
//         con.query(query, function (error, results) {
//             if (error) {
//                 console.error(error);
//                 return deferred.reject(error);
//             }
//         });
//         k++;
//         if(i == data.length){
//             deferred.resolve();
//         }
//     }
//
//     return deferred.promise;
// }

function updateWorkCheckInstructions(instructions){
    var deferred = q.defer();

    for(var i = 0 ; i < instructions.length; i++) {
        var dataUpdate = 'Insert into tasks_supreme(serviceId,taskId_i,taskId_l,taskId_r,task_l,task_r,task_i,';
        dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,';
        dataUpdate += 'measurement_l,measurement_r,measurement_i,';
        dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,';
        dataUpdate += 'flag_l,flag_i,flag_r)';
        dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        console.log('Query template' + dataUpdate);
        var query = mysql.format(dataUpdate, [instructions[i].serviceId
            , instructions[i].taskId_i,instructions[i].taskId_l,instructions[i].taskId_r
            , instructions[i].task_l,instructions[i].task_r,instructions[i].task_i
            , instructions[i].process_l,instructions[i].process_i,instructions[i].picture_l
            , instructions[i].picture_r,instructions[i].picture_i,instructions[i].measurement_l
            , instructions[i].measurement_r,instructions[i].measurement_i,instructions[i].timeTaken
            , instructions[i].tools_l,instructions[i].tools_r,instructions[i].tools_i,instructions[i].inference_l
            , instructions[i].inference_r,instructions[i].inference_i,instructions[i].version,0,0,0]);
        console.log(query);
        con.query(query, function (error, results) {
            if (error) {
                console.error(error);
                return deferred.reject(error);
            }
        });
        if((i+1) == instructions.length){
            deferred.resolve();
        }
    }

    return deferred.promise;
}

function updateInstructionDataSupreme(instructions) {
    var deferred = q.defer();

    var k = 1;

    for(var i = 4 ; i < instructions.length; i++){

        var dataUpdate = 'Insert into tasks_supreme(serviceId,taskId_i,taskId_l,taskId_r,task_l,task_r,task_i,';
        dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,';
        dataUpdate += 'measurement_l,measurement_r,measurement_i,';
        dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version)';
        dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        console.log('Query template' + dataUpdate);

        // var query = mysql.format(dataUpdate, [instructions[i].serviceId,instructions[]);

        console.log(query);
        con.query(query, function(error, results) {
            if (error) {
                console.error(error);
                return deferred.reject(error);
            }
        });
        k++;
        if(i == data.length ){
            deferred.resolve();
        }
    }


    return deferred.promise;
}

function updateInstructionData(data,serviceId) {
    var deferred = q.defer();

    var tempTask_i = '';
    var tempTask_r = '';
    var tempTask_l = '';

    var r = 1;
    var l = 1;
    var I = 1;

    for(var i = 4 ; i < data.length; i++){

        // var dataUpdate = 'Insert into tasks_h(serviceId,task_l,task_r,task_i,';
        // dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,';
        // dataUpdate += 'measurement_l,measurement_r,measurement_i,';
        // dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version)';
        // dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

        if(data[i][2] !== '' || data[i][10] !== '' || data[i][18] !== '' ||
            data[i][3] !== '' || data[i][11] !== '' || data[i][19] !== '') {

            var taskrId = null;
            var tasklId = null;
            var taskiId = null;

            if (data[i][2] !== '') {
                tempTask_r = data[i][2];
                taskrId = r;
                r++;
            } else {
                if (data[i][3] != '' && tempTask_r != '') {
                    data[i][2] = tempTask_r;
                    taskrId = r - 1;
                }
            }

            if (data[i][10] !== '') {
                tempTask_i = data[i][10];
                taskiId = I;
                I++;
            } else {
                if (data[i][11] != '' && tempTask_i != '') {
                    data[i][10] = tempTask_i;
                    taskiId = I - 1;
                }
            }

            if (data[i][18] !== '') {
                tempTask_l = data[i][18];
                tasklId = l;
                l++;
            } else {
                if (data[i][19] != '' && tempTask_l != '') {
                    data[i][18] = tempTask_l;
                    tasklId = l - 1;
                }
            }

            var dataUpdate = 'Insert into tasks_supreme(serviceId,taskId_l,taskId_r,taskId_i,task_l,task_r,task_i,';
            dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,flag_r,flag_i,flag_l,';
            dataUpdate += 'measurement_l,measurement_r,measurement_i,';
            dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version)';
            dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

            console.log('Query template' + dataUpdate);

            if(data[i][18] == ''){
                data[i][18] = null;
            }
            if(data[i][19] == ''){
                data[i][19] = null;
            }
            if(data[i][20] == ''){
                data[i][20] = null;
            }
            if(data[i][21] == ''){
                data[i][21] = null;
            }
            if(data[i][23] == ''){
                data[i][23] = null;
            }
            if(data[i][2] == ''){
                data[i][2] = null;
            }
            if(data[i][3] == ''){
                data[i][3] = null;
            }
            if(data[i][4] == ''){
                data[i][4] = null;
            }
            if(data[i][5] == ''){
                data[i][5] = null;
            }
            if(data[i][7] == ''){
                data[i][7] = null;
            }
            if(data[i][10] == ''){
                data[i][10] = null;
            }
            if(data[i][11] == ''){
                data[i][11] = null;
            }
            if(data[i][12] == ''){
                data[i][12] = null;
            }
            if(data[i][13] == ''){
                data[i][13] = null;
            }
            if(data[i][15] == ''){
                data[i][15] = null;
            }

            var query = mysql.format(dataUpdate, [serviceId, tasklId, taskrId, taskiId,
                data[i][18], data[i][2], data[i][10],
                data[i][19], data[i][3], data[i][11],
                null, null, null,0,0,0,
                data[i][20], data[i][4], data[i][12],
                20, data[i][21], data[i][5], data[i][13],
                data[i][23], data[i][7], data[i][15], 1]);

            console.log(query);
            con.query(query, function (error, results) {
                if (error) {
                    console.error(error);
                    return deferred.reject(error);
                }
            });
            if (i == data.length) {

                deferred.resolve(results);
            }
        }
    }

    return deferred.promise;
}

function updateInstructions(instructions) {

    var deferred = q.defer();

    var updateQuery = "Update tasks_supreme set task_l = ?,task_r = ?, task_i = ?,process_l = ?, process_r = ?";
    updateQuery += ",process_i = ?, picture_l=?,picture_r = ?, picture_i = ?,measurement_l = ?, measurement_r = ?";
    updateQuery += ",measurement_i = ?, timeTaken=?,tools_l = ?,tools_r=?,tools_i=?,inference_l = ?,inference_r=?";
    updateQuery += ",inference_i = ?,version=? where id = ?";

    for(var i = 0 ; i < instructions.length; i++){
        var updateQueryDetails = mysql.format(updateQuery,[instructions[i].task_l,instructions[i].task_r,instructions[i].task_i
            ,instructions[i].process_l,instructions[i].process_r,instructions[i].process_i,instructions[i].picture_l
            ,instructions[i].picture_r,instructions[i].picture_i,instructions[i].measurement_l,instructions[i].measurement_r
            ,instructions[i].measurement_i,instructions[i].timeTaken,instructions[i].tools_l,instructions[i].tools_r
            ,instructions[i].tools_i,instructions[i].inference_l,instructions[i].inference_r,instructions[i].inference_i
            ,instructions[i].version,instructions[i].id]);
        con.query(updateQueryDetails, function(error) {
            if (error) {
                console.error(error);
                return deferred.reject(error);
            }
            if((i+1)==instructions.length){
                deferred.resolve();
            }
        });
    }
    return deferred.promise;
}


function updateImages(fileName,id,selectedField){

    var deferred = q.defer();

    var query = 'Update tasks_supreme set '+selectedField+' = "'+fileName+'" where id = '+id;

    console.log(query);

    con.query(query,function (error,results) {
        if (error) {
            console.error(error);
            return deferred.reject(error);
        }
        deferred.resolve(results);
    });

    return deferred.promise;

}

function getInstructions(data){

    var deferred = q.defer();

    var query = "";


    if(data.flag == 'I'){
        query = "Select IFlag,serviceId from serviceregistration where id = "+data.orderRegId;
    }else if(data.flag == 'R'){
        query = "Select RFlag,serviceId from serviceregistration where id = "+data.orderRegId;
    }else if(data.flag == 'L'){
        query = "Select LFlag,serviceId from serviceregistration where id = "+data.orderRegId;
    }

    con.query(query,function (error,result) {




        if(error){
            return deferred.reject(error);
        }

        if(result && result.length > 0){

            getInstructionData(result[0]).then(function(rsl){
                updateInstructions(rsl).then(function(r){

                    if(data.flag == 'I') {
                        query = "select t.id,t.task_i as task,t.taskId_i as taskId,t.process_i as process,";
                        query += "t.picture_i as picture,t.flag_i as flag,t.tools_i as tools,t.timeTaken,";
                        query += "t.inference_i as inference,t.measurement_i as measurement";
                        query += " from tasks_supreme as t where t.taskId_i = "+(result[0].IFlag + 1);
                    }else if(data.flag == 'R') {
                        query = "select t.id,t.task_r as task,t.taskId_r as taskId,t.process_r as process,";
                        query += "t.picture_r as picture,t.flag_r as flag,t.tools_r as tools,t.timeTaken,";
                        query += "t.inference_r as inference,t.measurement_r as measurement";
                        query += " from tasks_supreme as t where t.taskId_r = "+(result[0].RFlag + 1);
                    }else if(data.flag == 'L') {
                        query = "select t.id,t.task_l as task,t.taskId_l as taskId,t.process_l as process,";
                        query += "t.picture_l as picture,t.flag_l as flag,t.tools_l as tools,t.timeTaken,";
                        query += "t.inference_l as inference,t.measurement_l as measurement";
                        query += " from tasks_supreme as t where t.taskId_l = "+(result[0].LFlag + 1);
                    }

                    con.query(query,function (err,rslt) {

                        if(err){
                            return deferred.reject(err);
                        }

                        deferred.resolve(rslt);

                    });
                });
            });

        }

    });

    return deferred.promise;

}

function getInstructionData(data) {
    var deferred = q.defer();

    var query = 'Select t.id,t.serviceId,t.taskId_l,t.taskId_r,t.taskId_i,t.task_r, t.task_i,';
    query += 't.task_l, t.process_r,t.process_i,t.process_l,';
    query += 't.picture_r,t.picture_i,t.picture_l,t.flag_r,t.flag_i,t.flag_l,t.tools_r,t.tools_i,t.tools_l,';
    query += 't.timeTaken,t.inference_r,t.inference_i,t.inference_l,t.measurement_r,t.measurement_i,t.measurement_l,t.version';
    query += ',s.service as service,m.modelName as model from tasks_supreme as t,service_type as s,model as m where s.id = serviceId';
    query += ' and s.modelId = m.id and t.serviceId = '+data.serviceId;

    // var query = 'Select id,serviceId,taskId,task_r, task_i, task_l, process_r,process_i,process_l,';
    // query += 'picture_r,picture_i,picture_l,flag_r,flag_i,flag_l,tools_r,tools_i,tools_l,';
    // query += 'timeTaken,inference_r,inference_i,inference_l,measurement_r,measurement_i,measurement_l,version';
    // query += ',s.service as service,m.modelName as model from tasks_h,service_type as s,model as m where s.id = serviceId';
    // query += " and s.modelId = m.id";

    console.log(query);
    con.query(query, function(error, results) {
        if (error) {
            console.error(error);
            return deferred.reject(error);
        }

        deferred.resolve(results);
    });

    return deferred.promise;
}


//
// function getInstructionData(data) {
//     var deferred = q.defer();
//
//     var query = 'Select t.id,t.serviceId,t.taskId,t.task_r, t.task_i, t.task_l, t.process_r,t.process_i,t.process_l,';
//         query += 't.picture_r,t.picture_i,t.picture_l,t.flag_r,t.flag_i,t.flag_l,t.tools_r,t.tools_i,t.tools_l,';
//         query += 't.timeTaken,t.inference_r,t.inference_i,t.inference_l,t.measurement_r,t.measurement_i,t.measurement_l,t.version';
//         query += ',s.service as service,m.modelName as model from tasks_h as t,service_type as s,model as m where s.id = serviceId';
//         query += ' and s.modelId = m.id and t.serviceId = '+data.serviceId;
//
//     // var query = 'Select id,serviceId,taskId,task_r, task_i, task_l, process_r,process_i,process_l,';
//     // query += 'picture_r,picture_i,picture_l,flag_r,flag_i,flag_l,tools_r,tools_i,tools_l,';
//     // query += 'timeTaken,inference_r,inference_i,inference_l,measurement_r,measurement_i,measurement_l,version';
//     // query += ',s.service as service,m.modelName as model from tasks_h,service_type as s,model as m where s.id = serviceId';
//     // query += " and s.modelId = m.id";
//
//     console.log(query);
//     con.query(query, function(error, results) {
//         if (error) {
//             console.error(error);
//             return deferred.reject(error);
//         }
//
//         var tempTask_i = '';
//         var tempTask_r = '';
//         var tempTask_l = '';
//
//         var r = 1;
//         var l = 1;
//         var I = 1;
//
//         var outputData = [];
//
//         for(var i = 0 ; i < results.length; i++){
//
//             if(results[i].task_r !== '' || results[i].task_i !== '' || results[i].task_l !== '' ||
//                 results[i].process_r !== '' || results[i].process_i !== '' || results[i].process_l !== ''){
//
//                 if(results[i].task_r !== ''){
//                     tempTask_r = results[i].task_r;
//                     results[i].taskId_r = r;
//                     r++;
//                 }else{
//                     if(results[i].process_r != '' && tempTask_r != ''){
//                         results[i].task_r = tempTask_r;
//                         results[i].taskId_r = r-1;
//                     }
//                 }
//
//                 if(results[i].task_i !== ''){
//                     tempTask_i = results[i].task_i;
//                     results[i].taskId_i = I;
//                     I++;
//                 }else{
//                     if(results[i].process_i != '' && tempTask_i != ''){
//                         results[i].task_i = tempTask_i;
//                         results[i].taskId_i = I-1;
//                     }
//                 }
//
//                 if(results[i].task_l !== ''){
//                     tempTask_l = results[i].task_l;
//                     results[i].taskId_l = l;
//                     l++;
//                 }else{
//                     if(results[i].process_l != '' && tempTask_l != ''){
//                         results[i].task_l = tempTask_l;
//                         results[i].taskId_l = l-1;
//                     }
//                 }
//
//                 var data={
//                     id:results[i].id,
//                     serviceId:results[i].serviceId,
//                     taskId_l:results[i].taskId_l,
//                     taskId_r:results[i].taskId_r,
//                     taskId_i:results[i].taskId_i,
//                     task_r:results[i].task_r,
//                     task_i:results[i].task_i,
//                     task_l:results[i].task_l,
//                     process_r:results[i].process_r,
//                     process_i:results[i].process_i,
//                     process_l:results[i].process_l,
//                     picture_r:results[i].picture_r,
//                     picture_i:results[i].picture_i,
//                     picture_l:results[i].picture_l,
//                     flag_r:results[i].flag_r,
//                     flag_i:results[i].flag_i,
//                     flag_l:results[i].flag_l,
//                     tools_r:results[i].tools_r,
//                     tools_i:results[i].tools_i,
//                     tools_l:results[i].tools_l,
//                     timeTaken:results[i].timeTaken,
//                     inference_r:results[i].inference_r,
//                     inference_l:results[i].inference_l,
//                     inference_i:results[i].inference_i,
//                     measurement_r:results[i].measurement_r,
//                     measurement_i:results[i].measurement_i,
//                     measurement_l:results[i].measurement_l,
//                     version:results[i].version,
//                     service:results[i].service,
//                     model:results[i].model
//                 }
//
//
//                 outputData.push(data);
//
//             }
//
//             if((i+1) == results.length){
//
//                 deferred.resolve(outputData);
//             }
//
//         }
//
//     });
//
//     return deferred.promise;
// }

module.exports = {
    updateInstructionData: updateInstructionData,
    getInstructionData: getInstructionData,
    updateImages:updateImages,
    updateInstructions:updateInstructions,
    updateInstructionDataSupreme:updateInstructionDataSupreme,
    getInstructions:getInstructions,
    updateWorkCheckInstructions:updateWorkCheckInstructions
};
