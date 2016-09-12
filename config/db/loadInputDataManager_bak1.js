/**
 * Created by CSS on 09-09-2016.
 */
var mysql = require('mysql');
var q = require('q');
var db = require('./../db');
var sqlDb = require('./../sqlDb');

var sql = require('mssql');

var fs = require('fs');
var con = mysql.createConnection(db);

var connection = new sql.Connection(sqlDb);

function updateWorkCheckInstructions(instructions,regOrderId){
    var deferred = q.defer();

    for(var i = 0 ; i < instructions.length; i++) {
        var dataUpdate = 'Insert into serviceworkcheck(serviceId,orderRegId,taskId_i,taskId_l,taskId_r,task_l,task_r,task_i,';
        dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,';
        dataUpdate += 'measurement_l,measurement_r,measurement_i,';
        dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,';
        dataUpdate += 'flag_l,flag_i,flag_r)';
        dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        console.log('Query template' + dataUpdate);
        var query = mysql.format(dataUpdate, [instructions[i].serviceId,regOrderId
            , instructions[i].taskId_i,instructions[i].taskId_l,instructions[i].taskId_r
            , instructions[i].task_l,instructions[i].task_r,instructions[i].task_i
            , instructions[i].process_l,instructions[i].process_r,instructions[i].process_i,instructions[i].picture_l
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
            if((i+1) == instructions.length){
                deferred.resolve(results);
            }
        });

    }

    return deferred.promise;
}

function updateInstructionData(data,service,model,picArr) {
    var deferred = q.defer();

    var tempTask_i = '';
    var tempTask_r = '';
    var tempTask_l = '';

    var r = 1;
    var l = 1;
    var I = 1;

    var version = 1;

    // var qry = "Select DISTINCT version from tasks_supreme where serviceId = "+serviceId;
    // qry += " and status = 'active'";
    var qry = "Select DISTINCT version from toyota_tasks_supreme where service = '"+service+"' and model = '"+model+"'";
    qry += " and status = 'active'";

    connection.connect().then(function () {
        var request = new sql.Request(connection);

        var ps = new sql.PreparedStatement(connection);
        request.query(qry).then(function (recordset) {
            console.log(recordset);

            if(recordset && recordset.length > 0){

                version = recordset[0].version;

                qry = "Update toyota_tasks_supreme set status = 'Mark as Deleted' where version = "+version+"";
                qry += " and service = '"+service+"' and model = '"+ model+"' and status = 'active'";


                version = Number(version)+0.1;

                request.query(qry,function (results,error) {

                    if(error){
                        connection.close();
                        return deferred.reject(error);
                    }


                    data.forEach(function (value,index) {

                        if(index > 4){

                            if(data[index][2] !== '' || data[index][10] !== '' || data[index][18] !== '' ||
                                data[index][3] !== '' || data[index][11] !== '' || data[index][19] !== '') {

                                var taskrId = null;
                                var tasklId = null;
                                var taskiId = null;

                                var picture_l = null;
                                var picture_r = null;
                                var picture_i = null;

                                if (data[index][2] !== '') {
                                    tempTask_r = data[index][2];
                                    taskrId = r;
                                    r++;
                                } else {
                                    if (data[index][3] != '' && tempTask_r != '') {
                                        data[index][2] = tempTask_r;
                                        taskrId = r - 1;
                                    }
                                }

                                if (data[index][10] !== '') {
                                    tempTask_i = data[index][10];
                                    taskiId = I;
                                    I++;
                                } else {
                                    if (data[index][11] != '' && tempTask_i != '') {
                                        data[index][10] = tempTask_i;
                                        taskiId = I - 1;
                                    }
                                }

                                if (data[index][18] !== '') {
                                    tempTask_l = data[index][18];
                                    tasklId = l;
                                    l++;
                                } else {
                                    if (data[index][19] != '' && tempTask_l != '') {
                                        data[index][18] = tempTask_l;
                                        tasklId = l - 1;
                                    }
                                }

                                // var dataUpdate = 'Insert into toyota_tasks_supreme(serviceId,taskId_l,taskId_r,taskId_i,task_l,task_r,task_i,';
                                // dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,flag_r,flag_i,flag_l,';
                                // dataUpdate += 'measurement_l,measurement_r,measurement_i,';
                                // dataUpdate += 'tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,status)';
                                // dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

                                var dataUpdate = 'Insert into toyota_tasks_supreme(service,model,taskId_l,taskId_r,taskId_i,task_l,task_r,task_i,';
                                dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,flag_r,flag_i,flag_l,';
                                dataUpdate += 'measurement_l,measurement_r,measurement_i,';
                                dataUpdate += 'tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,status)';
                                dataUpdate += ' values(@service,@model,@taskId_l,@taskId_r,@taskId_i,@task_l,@task_r,@task_i,';
                                dataUpdate += '@process_l,@process_r,@process_i,@picture_l,@picture_r,@picture_i,@flag_r,@flag_i,@flag_l,';
                                dataUpdate += '@measurement_l,@measurement_r,@measurement_i,';
                                dataUpdate += '@tools_l,@tools_r,@tools_i,@inference_l,@inference_r,@inference_i,@version,@status)';


                                console.log('Query template' + dataUpdate);

                                if(data[index][18] == ''){
                                    data[index][18] = null;
                                }
                                if(data[index][19] == ''){
                                    data[index][19] = null;
                                }
                                if(data[index][20] == ''){
                                    data[index][20] = null;
                                }
                                if(data[index][21] == ''){
                                    data[index][21] = null;
                                }
                                if(data[index][23] == ''){
                                    data[index][23] = null;
                                }
                                if(data[index][2] == ''){
                                    data[index][2] = null;
                                }
                                if(data[index][3] == ''){
                                    data[index][3] = null;
                                }
                                if(data[index][4] == ''){
                                    data[index][4] = null;
                                }
                                if(data[index][5] == ''){
                                    data[index][5] = null;
                                }
                                if(data[index][7] == ''){
                                    data[index][7] = null;
                                }
                                if(data[index][10] == ''){
                                    data[index][10] = null;
                                }
                                if(data[index][11] == ''){
                                    data[index][11] = null;
                                }
                                if(data[index][12] == ''){
                                    data[index][12] = null;
                                }
                                if(data[index][13] == ''){
                                    data[index][13] = null;
                                }
                                if(data[index][15] == ''){
                                    data[index][15] = null;
                                }

                                picArr.forEach(function(value1, index1) {
                                    if (value1.split('.')[0] == service+"-"+model+"-"+index + "-22" || value1.split('.')[0] == service+"-"+model+"-"+index + "-23") {
                                        var file = fs.readFileSync('public/uploads/excelImages/'+value1);
                                        picture_l = new Buffer(file).toString('base64');
                                        // console.log(picture_l);
                                    }
                                    if (value1.split('.')[0] == service+"-"+model+"-"+index + "-6" || value1.split('.')[0] == service+"-"+model+"-"+index + "-7") {
                                        var file = fs.readFileSync('public/uploads/excelImages/'+value1);
                                        picture_r = new Buffer(file).toString('base64');
                                    }
                                    if (value1.split('.')[0] == service+"-"+model+"-"+index + "-14" || value1.split('.')[0] == service+"-"+model+"-"+index + "-15") {
                                        var file = fs.readFileSync('public/uploads/excelImages/'+value1);
                                        picture_i = new Buffer(file).toString('base64');
                                    }
                                    if((index1+1) == picArr.length) {
                                        var ps = new sql.PreparedStatement(connection);
                                        ps.input('service', sql.NVarChar);
                                        ps.input('model', sql.NVarChar);
                                        ps.input('taskId_l', sql.BigInt);
                                        ps.input('taskId_r', sql.BigInt);
                                        ps.input('taskId_i',sql.BigInt);
                                        ps.input('task_l',sql.NVarChar);
                                        ps.input('task_r',sql.NVarChar);
                                        ps.input('task_i',sql.NVarChar);
                                        ps.input('process_l',sql.NVarChar);
                                        ps.input('process_r',sql.NVarChar);
                                        ps.input('process_i',sql.NVarChar);
                                        ps.input('picture_l',sql.NVarChar);
                                        ps.input('picture_r',sql.NVarChar);
                                        ps.input('picture_i',sql.NVarChar);
                                        ps.input('flag_r',sql.NVarChar);
                                        ps.input('flag_i',sql.NVarChar);
                                        ps.input('flag_l',sql.NVarChar);
                                        ps.input('measurement_l',sql.NVarChar);
                                        ps.input('measurement_r',sql.NVarChar);
                                        ps.input('measurement_i',sql.NVarChar);
                                        ps.input('tools_l',sql.NVarChar);
                                        ps.input('tools_r',sql.NVarChar);
                                        ps.input('tools_i',sql.NVarChar);
                                        ps.input('inference_l',sql.NVarChar);
                                        ps.input('inference_r',sql.NVarChar);
                                        ps.input('inference_i',sql.NVarChar);
                                        ps.input('version',sql.NVarChar);
                                        ps.input('status',sql.NVarChar);
                                        ps.prepare(dataUpdate, function(err) {
                                            // ... error checks
                                            if(err){
                                                console.log(err);
                                            }
                                            ps.execute({service: service,model:model,taskId_l:  tasklId,
                                                taskId_r:  taskrId, taskId_i: taskiId, task_l : data[index][18],
                                                task_r: data[index][2],task_i: data[index][10], process_l: data[index][19],
                                                process_r :  data[index][3], process_i :  data[index][11],
                                                picture_l : picture_l, picture_r : picture_r,picture_i: picture_i,
                                                flag_l:'0',flag_r:'0',flag_i : '0', measurement_l : data[index][20],
                                                measurement_r:data[index][4],measurement_i: data[index][12],
                                                tools_l: data[index][21], tools_r: data[index][5], tools_i : data[index][13],
                                                inference_l : data[index][23],inference_r: data[index][7], inference_i :data[index][15],
                                                version : Number(version), status:'active'}, function (error, results) {
                                                if (error) {
                                                    console.error(error);
                                                    connection.close();
                                                    return deferred.reject(error);
                                                }
                                                ps.unprepare(function(err) {
                                                    if(err){
                                                        console.log(err);
                                                    }

                                                });
                                            });
                                            if ((index+1) == data.length) {

                                                deleteTaskFin(service,model).then(function(result,error){

                                                    if(error){
                                                        return deferred.reject(error);
                                                    }

                                                    updateTaskFin(model,service).then(function(result,error){

                                                        if(error){
                                                            return deferred.reject(error);
                                                        }

                                                        deferred.resolve("Successfully Inserted");
                                                    });
                                                });
                                            }


                                        });

                                        // var query = request.format(dataUpdate, [serviceId, tasklId, taskrId, taskiId,
                                        //     data[i][18], data[i][2], data[i][10],
                                        //     data[i][19], data[i][3], data[i][11],
                                        //     picture_l, picture_r, picture_i,'0','0','0',
                                        //     data[i][20], data[i][4], data[i][12],
                                        //     data[i][21],
                                        // data[i][5], data[i][13],
                                        //     data[i][23], data[i][7], data[i][15], Number(version), 'active']);
                                        //
                                        // console.log(query);
                                        // request.query(query,

                                    }

                                });

                            }

                        }

                    });

                    // var dataUpdate = 'Insert into tasks_h(serviceId,task_l,task_r,task_i,';
                    // dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,';
                    // dataUpdate += 'measurement_l,measurement_r,measurement_i,';
                    // dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version)';
                    // dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';


                });

            }else{
                data.forEach(function (value,index) {

                    if(index > 4){

                        if(data[index][2] !== '' || data[index][10] !== '' || data[index][18] !== '' ||
                            data[index][3] !== '' || data[index][11] !== '' || data[index][19] !== '') {

                            var taskrId = null;
                            var tasklId = null;
                            var taskiId = null;

                            var picture_l = null;
                            var picture_r = null;
                            var picture_i = null;

                            if (data[index][2] !== '') {
                                tempTask_r = data[index][2];
                                taskrId = r;
                                r++;
                            } else {
                                if (data[index][3] != '' && tempTask_r != '') {
                                    data[index][2] = tempTask_r;
                                    taskrId = r - 1;
                                }
                            }

                            if (data[index][10] !== '') {
                                tempTask_i = data[index][10];
                                taskiId = I;
                                I++;
                            } else {
                                if (data[index][11] != '' && tempTask_i != '') {
                                    data[index][10] = tempTask_i;
                                    taskiId = I - 1;
                                }
                            }

                            if (data[index][18] !== '') {
                                tempTask_l = data[index][18];
                                tasklId = l;
                                l++;
                            } else {
                                if (data[index][19] != '' && tempTask_l != '') {
                                    data[index][18] = tempTask_l;
                                    tasklId = l - 1;
                                }
                            }

                            // var dataUpdate = 'Insert into toyota_tasks_supreme(serviceId,taskId_l,taskId_r,taskId_i,task_l,task_r,task_i,';
                            // dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,flag_r,flag_i,flag_l,';
                            // dataUpdate += 'measurement_l,measurement_r,measurement_i,';
                            // dataUpdate += 'tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,status)';
                            // dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

                            var dataUpdate = 'Insert into toyota_tasks_supreme(service,model,taskId_l,taskId_r,taskId_i,task_l,task_r,task_i,';
                            dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,flag_r,flag_i,flag_l,';
                            dataUpdate += 'measurement_l,measurement_r,measurement_i,';
                            dataUpdate += 'tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,status)';
                            dataUpdate += ' values(@service,@model,@taskId_l,@taskId_r,@taskId_i,@task_l,@task_r,@task_i,';
                            dataUpdate += '@process_l,@process_r,@process_i,@picture_l,@picture_r,@picture_i,@flag_r,@flag_i,@flag_l,';
                            dataUpdate += '@measurement_l,@measurement_r,@measurement_i,';
                            dataUpdate += '@tools_l,@tools_r,@tools_i,@inference_l,@inference_r,@inference_i,@version,@status)';


                            console.log('Query template' + dataUpdate);

                            if(data[index][18] == ''){
                                data[index][18] = null;
                            }
                            if(data[index][19] == ''){
                                data[index][19] = null;
                            }
                            if(data[index][20] == ''){
                                data[index][20] = null;
                            }
                            if(data[index][21] == ''){
                                data[index][21] = null;
                            }
                            if(data[index][23] == ''){
                                data[index][23] = null;
                            }
                            if(data[index][2] == ''){
                                data[index][2] = null;
                            }
                            if(data[index][3] == ''){
                                data[index][3] = null;
                            }
                            if(data[index][4] == ''){
                                data[index][4] = null;
                            }
                            if(data[index][5] == ''){
                                data[index][5] = null;
                            }
                            if(data[index][7] == ''){
                                data[index][7] = null;
                            }
                            if(data[index][10] == ''){
                                data[index][10] = null;
                            }
                            if(data[index][11] == ''){
                                data[index][11] = null;
                            }
                            if(data[index][12] == ''){
                                data[index][12] = null;
                            }
                            if(data[index][13] == ''){
                                data[index][13] = null;
                            }
                            if(data[index][15] == ''){
                                data[index][15] = null;
                            }

                            picArr.forEach(function(value1, index1) {
                                if (value1.split('.')[0] == service+"-"+model+"-"+index + "-22" || value1.split('.')[0] == service+"-"+model+"-"+index + "-23") {
                                    var file = fs.readFileSync('public/uploads/excelImages/'+value1);
                                    picture_l = new Buffer(file).toString('base64');
                                    // console.log(picture_l);
                                }
                                if (value1.split('.')[0] == service+"-"+model+"-"+index + "-6" || value1.split('.')[0] == service+"-"+model+"-"+index + "-7") {
                                    var file = fs.readFileSync('public/uploads/excelImages/'+value1);
                                    picture_r = new Buffer(file).toString('base64');
                                }
                                if (value1.split('.')[0] == service+"-"+model+"-"+index + "-14" || value1.split('.')[0] == service+"-"+model+"-"+index + "-15") {
                                    var file = fs.readFileSync('public/uploads/excelImages/'+value1);
                                    picture_i = new Buffer(file).toString('base64');
                                }
                                if((index1+1) == picArr.length) {
                                    var ps = new sql.PreparedStatement(connection);
                                    ps.input('service', sql.NVarChar);
                                    ps.input('model', sql.NVarChar);
                                    ps.input('taskId_l', sql.BigInt);
                                    ps.input('taskId_r', sql.BigInt);
                                    ps.input('taskId_i',sql.BigInt);
                                    ps.input('task_l',sql.NVarChar);
                                    ps.input('task_r',sql.NVarChar);
                                    ps.input('task_i',sql.NVarChar);
                                    ps.input('process_l',sql.NVarChar);
                                    ps.input('process_r',sql.NVarChar);
                                    ps.input('process_i',sql.NVarChar);
                                    ps.input('picture_l',sql.NVarChar);
                                    ps.input('picture_r',sql.NVarChar);
                                    ps.input('picture_i',sql.NVarChar);
                                    ps.input('flag_r',sql.NVarChar);
                                    ps.input('flag_i',sql.NVarChar);
                                    ps.input('flag_l',sql.NVarChar);
                                    ps.input('measurement_l',sql.NVarChar);
                                    ps.input('measurement_r',sql.NVarChar);
                                    ps.input('measurement_i',sql.NVarChar);
                                    ps.input('tools_l',sql.NVarChar);
                                    ps.input('tools_r',sql.NVarChar);
                                    ps.input('tools_i',sql.NVarChar);
                                    ps.input('inference_l',sql.NVarChar);
                                    ps.input('inference_r',sql.NVarChar);
                                    ps.input('inference_i',sql.NVarChar);
                                    ps.input('version',sql.NVarChar);
                                    ps.input('status',sql.NVarChar);
                                    ps.prepare(dataUpdate, function(err) {
                                        // ... error checks
                                        if(err){
                                            console.log(err);
                                        }
                                        ps.execute({service: service,model:model,taskId_l:  tasklId,
                                            taskId_r:  taskrId, taskId_i: taskiId, task_l : data[index][18],
                                            task_r: data[index][2],task_i: data[index][10], process_l: data[index][19],
                                            process_r :  data[index][3], process_i :  data[index][11],
                                            picture_l : picture_l, picture_r : picture_r,picture_i: picture_i,
                                            flag_l:'0',flag_r:'0',flag_i : '0', measurement_l : data[index][20],
                                            measurement_r:data[index][4],measurement_i: data[index][12],
                                            tools_l: data[index][21], tools_r: data[index][5], tools_i : data[index][13],
                                            inference_l : data[index][23],inference_r: data[index][7], inference_i :data[index][15],
                                            version : Number(version), status:'active'}, function (error, results) {
                                            if (error) {
                                                console.error(error);
                                                connection.close();
                                                return deferred.reject(error);
                                            }
                                            ps.unprepare(function(err) {
                                                if(err){
                                                    console.log(err);
                                                }

                                            });
                                        });
                                        if ((index+1) == data.length) {

                                            deleteTaskFin(service,model).then(function(result,error){

                                                if(error){
                                                    return deferred.reject(error);
                                                }

                                                updateTaskFin(model,service).then(function(result,error){

                                                    if(error){
                                                        return deferred.reject(error);
                                                    }

                                                    deferred.resolve("Successfully Inserted");
                                                });
                                            });
                                        }


                                    });

                                    // var query = request.format(dataUpdate, [serviceId, tasklId, taskrId, taskiId,
                                    //     data[i][18], data[i][2], data[i][10],
                                    //     data[i][19], data[i][3], data[i][11],
                                    //     picture_l, picture_r, picture_i,'0','0','0',
                                    //     data[i][20], data[i][4], data[i][12],
                                    //     data[i][21],
                                    // data[i][5], data[i][13],
                                    //     data[i][23], data[i][7], data[i][15], Number(version), 'active']);
                                    //
                                    // console.log(query);
                                    // request.query(query,

                                }

                            });

                        }

                    }

                });

                // var dataUpdate = 'Insert into tasks_h(serviceId,task_l,task_r,task_i,';
                // dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,';
                // dataUpdate += 'measurement_l,measurement_r,measurement_i,';
                // dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version)';
                // dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';


            }

        }).catch(function (err) {
            console.log(err);
            connection.close();
        });
    }).catch(function (err) {
        console.log(err);
    });



    // con.query(qry,function (error,results) {

    // if(error){
    //     return deferred.reject(error);
    // }
    //
    // if(results && results.length > 0){
    //
    //     version = results[0].version;
    //
    //     qry = "Update tasks_supreme set status = 'Mark as Deleted' where version = "+version+"";
    //     qry += " and serviceId = "+serviceId+" and status = 'active'";
    //
    //
    //     version = Number(version)+0.1;
    //
    //     con.query(qry,function (error,results) {
    //
    //         if(error){
    //             return deferred.reject(error);
    //         }
    //
    //         for(var i = 4 ; i < data.length; i++){
    //
    //             // var dataUpdate = 'Insert into tasks_h(serviceId,task_l,task_r,task_i,';
    //             // dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,';
    //             // dataUpdate += 'measurement_l,measurement_r,measurement_i,';
    //             // dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version)';
    //             // dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    //
    //             if(data[i][2] !== '' || data[i][10] !== '' || data[i][18] !== '' ||
    //                 data[i][3] !== '' || data[i][11] !== '' || data[i][19] !== '') {
    //
    //                 var taskrId = null;
    //                 var tasklId = null;
    //                 var taskiId = null;
    //
    //                 var picture_l = null;
    //                 var picture_r = null;
    //                 var picture_i = null;
    //
    //                 if (data[i][2] !== '') {
    //                     tempTask_r = data[i][2];
    //                     taskrId = r;
    //                     r++;
    //                 } else {
    //                     if (data[i][3] != '' && tempTask_r != '') {
    //                         data[i][2] = tempTask_r;
    //                         taskrId = r - 1;
    //                     }
    //                 }
    //
    //                 if (data[i][10] !== '') {
    //                     tempTask_i = data[i][10];
    //                     taskiId = I;
    //                     I++;
    //                 } else {
    //                     if (data[i][11] != '' && tempTask_i != '') {
    //                         data[i][10] = tempTask_i;
    //                         taskiId = I - 1;
    //                     }
    //                 }
    //
    //                 if (data[i][18] !== '') {
    //                     tempTask_l = data[i][18];
    //                     tasklId = l;
    //                     l++;
    //                 } else {
    //                     if (data[i][19] != '' && tempTask_l != '') {
    //                         data[i][18] = tempTask_l;
    //                         tasklId = l - 1;
    //                     }
    //                 }
    //
    //                 var dataUpdate = 'Insert into tasks_supreme(serviceId,taskId_l,taskId_r,taskId_i,task_l,task_r,task_i,';
    //                 dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,flag_r,flag_i,flag_l,';
    //                 dataUpdate += 'measurement_l,measurement_r,measurement_i,';
    //                 dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,status)';
    //                 dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    //
    //                 console.log('Query template' + dataUpdate);
    //
    //                 if(data[i][18] == ''){
    //                     data[i][18] = null;
    //                 }
    //                 if(data[i][19] == ''){
    //                     data[i][19] = null;
    //                 }
    //                 if(data[i][20] == ''){
    //                     data[i][20] = null;
    //                 }
    //                 if(data[i][21] == ''){
    //                     data[i][21] = null;
    //                 }
    //                 if(data[i][23] == ''){
    //                     data[i][23] = null;
    //                 }
    //                 if(data[i][2] == ''){
    //                     data[i][2] = null;
    //                 }
    //                 if(data[i][3] == ''){
    //                     data[i][3] = null;
    //                 }
    //                 if(data[i][4] == ''){
    //                     data[i][4] = null;
    //                 }
    //                 if(data[i][5] == ''){
    //                     data[i][5] = null;
    //                 }
    //                 if(data[i][7] == ''){
    //                     data[i][7] = null;
    //                 }
    //                 if(data[i][10] == ''){
    //                     data[i][10] = null;
    //                 }
    //                 if(data[i][11] == ''){
    //                     data[i][11] = null;
    //                 }
    //                 if(data[i][12] == ''){
    //                     data[i][12] = null;
    //                 }
    //                 if(data[i][13] == ''){
    //                     data[i][13] = null;
    //                 }
    //                 if(data[i][15] == ''){
    //                     data[i][15] = null;
    //                 }
    //
    //                 picArr.forEach(function(value, index) {
    //                     if (value.split('.')[0] == serviceId+"-"+i + "-22" || value.split('.')[0] == serviceId+"-"+i + "-23") {
    //                         picture_l = value;
    //                     }
    //                     if (value.split('.')[0] == serviceId+"-"+i + "-6" || value.split('.')[0] == serviceId+"-"+i + "-7") {
    //                         picture_r = value;
    //                     }
    //                     if (value.split('.')[0] == serviceId+"-"+i + "-14" || value.split('.')[0] == serviceId+"-"+i + "-15") {
    //                         picture_i = value;
    //                     }
    //                     if((index+1) == picArr.length) {
    //
    //                         var query = mysql.format(dataUpdate, [serviceId, tasklId, taskrId, taskiId,
    //                             data[i][18], data[i][2], data[i][10],
    //                             data[i][19], data[i][3], data[i][11],
    //                             picture_l, picture_r, picture_i,0,0,0,
    //                             data[i][20], data[i][4], data[i][12],
    //                             20, data[i][21], data[i][5], data[i][13],
    //                             data[i][23], data[i][7], data[i][15], Number(version), 'active']);
    //
    //                         console.log(query);
    //                         con.query(query, function (error, results) {
    //                             if (error) {
    //                                 console.error(error);
    //                                 return deferred.reject(error);
    //                             }
    //                         });
    //                         if (i == data.length) {
    //
    //                             deferred.resolve(results);
    //                         }
    //
    //                     }
    //
    //                 });
    //
    //             }
    //         }
    //
    //     });
    //
    // }else{
    //     for(var i = 4 ; i < data.length; i++){
    //
    //         // var dataUpdate = 'Insert into tasks_h(serviceId,task_l,task_r,task_i,';
    //         // dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,';
    //         // dataUpdate += 'measurement_l,measurement_r,measurement_i,';
    //         // dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version)';
    //         // dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    //
    //         if(data[i][2] !== '' || data[i][10] !== '' || data[i][18] !== '' ||
    //             data[i][3] !== '' || data[i][11] !== '' || data[i][19] !== '') {
    //
    //             var taskrId = null;
    //             var tasklId = null;
    //             var taskiId = null;
    //
    //             var picture_l = null;
    //             var picture_r = null;
    //             var picture_i = null;
    //
    //             if (data[i][2] !== '') {
    //                 tempTask_r = data[i][2];
    //                 taskrId = r;
    //                 r++;
    //             } else {
    //                 if (data[i][3] != '' && tempTask_r != '') {
    //                     data[i][2] = tempTask_r;
    //                     taskrId = r - 1;
    //                 }
    //             }
    //
    //             if (data[i][10] !== '') {
    //                 tempTask_i = data[i][10];
    //                 taskiId = I;
    //                 I++;
    //             } else {
    //                 if (data[i][11] != '' && tempTask_i != '') {
    //                     data[i][10] = tempTask_i;
    //                     taskiId = I - 1;
    //                 }
    //             }
    //
    //             if (data[i][18] !== '') {
    //                 tempTask_l = data[i][18];
    //                 tasklId = l;
    //                 l++;
    //             } else {
    //                 if (data[i][19] != '' && tempTask_l != '') {
    //                     data[i][18] = tempTask_l;
    //                     tasklId = l - 1;
    //                 }
    //             }
    //
    //             var dataUpdate = 'Insert into tasks_supreme(serviceId,taskId_l,taskId_r,taskId_i,task_l,task_r,task_i,';
    //             dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,flag_r,flag_i,flag_l,';
    //             dataUpdate += 'measurement_l,measurement_r,measurement_i,';
    //             dataUpdate += 'timeTaken,tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,status)';
    //             dataUpdate += ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    //
    //             console.log('Query template' + dataUpdate);
    //
    //             if(data[i][18] == ''){
    //                 data[i][18] = null;
    //             }
    //             if(data[i][19] == ''){
    //                 data[i][19] = null;
    //             }
    //             if(data[i][20] == ''){
    //                 data[i][20] = null;
    //             }
    //             if(data[i][21] == ''){
    //                 data[i][21] = null;
    //             }
    //             if(data[i][23] == ''){
    //                 data[i][23] = null;
    //             }
    //             if(data[i][2] == ''){
    //                 data[i][2] = null;
    //             }
    //             if(data[i][3] == ''){
    //                 data[i][3] = null;
    //             }
    //             if(data[i][4] == ''){
    //                 data[i][4] = null;
    //             }
    //             if(data[i][5] == ''){
    //                 data[i][5] = null;
    //             }
    //             if(data[i][7] == ''){
    //                 data[i][7] = null;
    //             }
    //             if(data[i][10] == ''){
    //                 data[i][10] = null;
    //             }
    //             if(data[i][11] == ''){
    //                 data[i][11] = null;
    //             }
    //             if(data[i][12] == ''){
    //                 data[i][12] = null;
    //             }
    //             if(data[i][13] == ''){
    //                 data[i][13] = null;
    //             }
    //             if(data[i][15] == ''){
    //                 data[i][15] = null;
    //             }
    //
    //             picArr.forEach(function(value, index) {
    //                 if (value.split('.')[0] == serviceId+"-"+i + "-22" || value.split('.')[0] == serviceId+"-"+i + "-23") {
    //                     picture_l = value;
    //                 }
    //                 if (value.split('.')[0] == serviceId+"-"+i + "-6" || value.split('.')[0] == serviceId+"-"+i + "-7") {
    //                     picture_r = value;
    //                 }
    //                 if (value.split('.')[0] == serviceId+"-"+i + "-14" || value.split('.')[0] == serviceId+"-"+i + "-15") {
    //                     picture_i = value;
    //                 }
    //                 if((index+1) == picArr.length) {
    //
    //                     var query = mysql.format(dataUpdate, [serviceId, tasklId, taskrId, taskiId,
    //                         data[i][18], data[i][2], data[i][10],
    //                         data[i][19], data[i][3], data[i][11],
    //                         picture_l, picture_r, picture_i,0,0,0,
    //                         data[i][20], data[i][4], data[i][12],
    //                         20, data[i][21], data[i][5], data[i][13],
    //                         data[i][23], data[i][7], data[i][15], Number(version), 'active']);
    //
    //                     console.log(query);
    //                     con.query(query, function (error, results) {
    //                         if (error) {
    //                             console.error(error);
    //                             return deferred.reject(error);
    //                         }
    //                     });
    //                     if (i == data.length) {
    //
    //                         deferred.resolve(results);
    //                     }
    //
    //                 }
    //
    //             });
    //
    //         }
    //     }
    // }


    // });

    return deferred.promise;
}


function updateTaskFin(model,service){

    var deferred = q.defer();

    var tasks = [];

    var request = new sql.Request(connection);
    var query = "Select taskId_r from toyota_tasks_supreme where model = '"+model+"'";
    query += " and service = '"+service+"' and status = 'active' and taskId_r is Not null";
    var ps = new sql.PreparedStatement(connection);
    request.query(query).then(function (recordset,err) {

        if(err){
            return deferred.reject(err);
        }

        if(recordset && recordset.length > 0) {

            var data = recordset;

            data.forEach(function (value, index) {

                query = "Select taskId_r as Task_id,task_r as Task,service as MType,model as MName";
                query += ", picture_r as Image, process_r as Process, tools_r as Tools, inference_r";
                query += " as Inference";
                query += " from toyota_tasks_supreme where taskId_r = " + value.taskId_r + " and status = 'active'";

                request.query(query).then(function (records, err) {

                    if (err) {
                        return deferred.reject(err);
                    }
                    if (records && records.length > 0) {

                        var d = records;
                        var data = {};
                        data.Tools= '';
                        data.Process= '';
                        data.Inference= '';
                        data.Image= null;
                        data.Image1= null;
                        data.Image2= null;
                        data.Image3= null;
                        data.Image4= null;
                        data.Image5= null;
                        data.Image6= null;
                        data.value1= null;
                        data.value2= null;
                        data.value3= null;
                        data.value4= null;
                        data.value5= null;
                        data.value6= null;
                        data.TTime= null;
                        data.Rflag= 0;
                        data.Iflag= 0;
                        data.Lflag= 0;

                        d.forEach(function (value1, index1) {

                            if (index1 == 0) {
                                data.MName = value1.MName;
                                data.MType = value1.MType;
                                data.Task_id = value1.Task_id;
                                data.Task = value1.Task;
                                data.Type = 'R';
                                data.Image = value1.Image
                            }

                            if (index1 == 1) {
                                data.Image1 = value1.Image;
                            }
                            if (index1 == 2) {
                                data.Image2 = value1.Image;
                            }
                            if (index1 == 3) {
                                data.Image3 = value1.Image;
                            }
                            if (index1 == 4) {
                                data.Image4 = value1.Image;
                            }
                            if (index1 == 5) {
                                data.Image5 = value1.Image;
                            }
                            if (index1 == 6) {
                                data.Image6 = value1.Image;
                            }

                            data.Tools = data.Tools + value1.Tools;
                            data.Process = data.Process + value1.Process;
                            data.Inference = data.Inference + value1.Inference;

                            if ((index1 + 1) == d.length) {
                                tasks.push(data);
                            }
                        });

                    }
                });

                if ((index + 1) == data.length) {

                    var query = "Select taskId_i from toyota_tasks_supreme where model = '" + model + "'";
                    query += " and service = '" + service + "' and status = 'active' and taskId_i is Not null";
                    var ps = new sql.PreparedStatement(connection);
                    request.query(query).then(function (recordset, err) {

                        if (err) {
                            return deferred.reject(err);
                        }

                        if (recordset && recordset.length > 0) {

                            var data1 = recordset;

                            data1.forEach(function (value2, index2) {

                                query = "Select taskId_i as Task_id,task_i as Task,service as MType,model as MName";
                                query += ", picture_i as Image, process_i as Process, tools_i as Tools, inference_i";
                                query += " as Inference"
                                query += " from toyota_tasks_supreme where taskId_i = " + value2.taskId_i + " and status = 'active'";

                                request.query(query).then(function (records, err) {

                                    if (err) {
                                        return deferred.reject(err);
                                    }
                                    if (records && records.length > 0) {
                                        var data = {};
                                        data.Tools= '';
                                        data.Process= '';
                                        data.Inference= '';
                                        data.Image= null;
                                        data.Image1= null;
                                        data.Image2= null;
                                        data.Image3= null;
                                        data.Image4= null;
                                        data.Image5= null;
                                        data.Image6= null;
                                        data.value1= null;
                                        data.value2= null;
                                        data.value3= null;
                                        data.value4= null;
                                        data.value5= null;
                                        data.value6= null;
                                        data.TTime= null;
                                        data.Rflag= 0;
                                        data.Iflag= 0;
                                        data.Lflag= 0;


                                        records.forEach(function (value1, index1) {

                                            if (index1 == 0) {
                                                data.MName = value1.MName;
                                                data.MType = value1.MType;
                                                data.Task_id = value1.Task_id;
                                                data.Task = value1.Task;
                                                data.Type = 'I';
                                                data.Image = value1.Image
                                            }

                                            if (index1 == 1) {
                                                data.Image1 = value1.Image;
                                            }
                                            if (index1 == 2) {
                                                data.Image2 = value1.Image;
                                            }
                                            if (index1 == 3) {
                                                data.Image3 = value1.Image;
                                            }
                                            if (index1 == 4) {
                                                data.Image4 = value1.Image;
                                            }
                                            if (index1 == 5) {
                                                data.Image5 = value1.Image;
                                            }
                                            if (index1 == 6) {
                                                data.Image6 = value1.Image;
                                            }

                                            data.Tools = data.Tools + value1.Tools;
                                            data.Process = data.Process + value1.Process;
                                            data.Inference = data.Inference + value1.Inference;

                                            if ((index1 + 1) == records.length) {
                                                tasks.push(data);
                                            }

                                        });

                                    }

                                });

                                if ((index2 + 1) == data1.length) {

                                    var query = "Select taskId_l from toyota_tasks_supreme where model = '" + model + "'";
                                    query += " and service = '" + service + "' and status = 'active' and taskId_l is Not null";
                                    var ps = new sql.PreparedStatement(connection);
                                    request.query(query).then(function (recordset, err) {

                                        if (err) {
                                            return deferred.reject(err);
                                        }

                                        if (recordset && recordset.length > 0) {

                                            var data3 = recordset;

                                            data3.forEach(function (value3, index3) {

                                                query = "Select taskId_l as Task_id,task_l as Task,service as MType,model as MName";
                                                query += ", picture_l as Image, process_l as Process, tools_l as Tools, inference_l";
                                                query += " as Inference"
                                                query += " from toyota_tasks_supreme where taskId_l = " + value3.taskId_l + " and status = 'active'";

                                                request.query(query).then(function (records, err) {

                                                    if (err) {
                                                        return deferred.reject(err);
                                                    }
                                                    if (records && records.length > 0) {
                                                        var data = {};
                                                        data.Tools= '';
                                                        data.Process= '';
                                                        data.Inference= '';
                                                        data.Image= null;
                                                        data.Image1= null;
                                                        data.Image2= null;
                                                        data.Image3= null;
                                                        data.Image4= null;
                                                        data.Image5= null;
                                                        data.Image6= null;
                                                        data.value1= null;
                                                        data.value2= null;
                                                        data.value3= null;
                                                        data.value4= null;
                                                        data.value5= null;
                                                        data.value6= null;
                                                        data.TTime= null;
                                                        data.Rflag= 0;
                                                        data.Iflag= 0;
                                                        data.Lflag= 0;


                                                        records.forEach(function (value1, index1) {

                                                            if (index1 == 0) {
                                                                data.MName = value1.MName;
                                                                data.MType = value1.MType;
                                                                data.Task_id = value1.Task_id;
                                                                data.Task = value1.Task;
                                                                data.Type = 'L';
                                                                data.Image = value1.Image
                                                            }

                                                            if (index1 == 1) {
                                                                data.Image1 = value1.Image;
                                                            }
                                                            if (index1 == 2) {
                                                                data.Image2 = value1.Image;
                                                            }
                                                            if (index1 == 3) {
                                                                data.Image3 = value1.Image;
                                                            }
                                                            if (index1 == 4) {
                                                                data.Image4 = value1.Image;
                                                            }
                                                            if (index1 == 5) {
                                                                data.Image5 = value1.Image;
                                                            }
                                                            if (index1 == 6) {
                                                                data.Image6 = value1.Image;
                                                            }

                                                            data.Tools = data.Tools + value1.Tools;
                                                            data.Process = data.Process + value1.Process;
                                                            data.Inference = data.Inference + value1.Inference;

                                                            if ((index1 + 1) == records.length) {
                                                                tasks.push(data);
                                                                if ((index3 + 1) == data3.length) {

                                                                    updateTaskFinTable(tasks).then(function (result) {
                                                                        deferred.resolve(result);
                                                                    });


                                                                }
                                                            }

                                                        });

                                                    }

                                                });



                                            });

                                        }

                                    });

                                }

                            });

                        }

                    });

                }

            });

        }

    });

    return deferred.promise;
}


function deleteTaskFin(service,model){

    var deferred = q.defer();

    var query = "Delete from Toyota_FINTask where MType = '"+service+"' and MName = '"+model+"'";

    var request = new sql.Request(connection);

    request.query(query,function (records,err) {

        if(err){
            return deferred.reject(err);
        }

        deferred.resolve(records);

    });

    return deferred.promise;

}

function updateTaskFinTable(data) {

    var deferred = q.defer();

    data.forEach(function (value,index) {

        var dataUpdate = 'Insert into Toyota_FINTask(SNo,MName,MType,Task_id,Task,Type,Process,Tools,Inference,';
        dataUpdate += 'Image,Image1,Image2,Image3,Image4,Image5,Image6,value1,value2,';
        dataUpdate += 'value3,value4,value5,';
        dataUpdate += 'value6,TTime,Rflag,Iflag,Lflag)';
        dataUpdate += ' values(@SNo,@MName,@MType,@Task_id,@Task,@Type,@Process,@Tools,@Inference,';
        dataUpdate += '@Image,@Image1,@Image2,@Image3,@Image4,@Image5,@Image6,@value1,@value2,';
        dataUpdate += '@value3,@value4,@value5,';
        dataUpdate += '@value6,@TTime,@Rflag,@Iflag,@Lflag)';

        var ps = new sql.PreparedStatement(connection);
        ps.input('SNo',sql.NVarChar);
        ps.input('MName', sql.NVarChar);
        ps.input('MType', sql.NVarChar);
        ps.input('Task_id', sql.NVarChar);
        ps.input('Task', sql.NVarChar);
        ps.input('Type',sql.NVarChar);
        ps.input('Process',sql.NVarChar);
        ps.input('Tools',sql.NVarChar);
        ps.input('Inference',sql.NVarChar);
        ps.input('Image',sql.NVarChar);
        ps.input('Image1',sql.NVarChar);
        ps.input('Image2',sql.NVarChar);
        ps.input('Image3',sql.NVarChar);
        ps.input('Image4',sql.NVarChar);
        ps.input('Image5',sql.NVarChar);
        ps.input('Image6',sql.NVarChar);
        ps.input('value1',sql.NVarChar);
        ps.input('value2',sql.NVarChar);
        ps.input('value3',sql.NVarChar);
        ps.input('value4',sql.NVarChar);
        ps.input('value5',sql.NVarChar);
        ps.input('value6',sql.NVarChar);
        ps.input('TTime',sql.NVarChar);
        ps.input('Rflag',sql.NVarChar);
        ps.input('Iflag',sql.NVarChar);
        ps.input('Lflag',sql.NVarChar);
        ps.prepare(dataUpdate, function(err) {
            // ... error checks
            if(err){
                console.log(err);
            }
            ps.execute({SNo:(index+1),MName:value.MName,MType:value.MType,Task_id:value.Task_id,Task:value.Task
                ,Type:value.Type,Process:value.Process,Tools:value.Tools,Inference:value.Inference,
                Image:value.Image,Image1:value.Image1,Image2:value.Image2,Image3:value.Image3
                ,Image4:value.Image4,Image5:value.Image5,Image6:value.Image6,value1:value.value1
                ,value2:value.value2,value3:value.value3,value4:value.value4,value5:value.value5,
                value6:value.value6,TTime:value.TTime,Rflag:value.Rflag,Iflag:value.Iflag
                ,Lflag:value.Lflag}, function (error, results) {
                if (error) {
                    console.error(error);
                    connection.close();
                    return deferred.reject(error);
                }
                ps.unprepare(function(err) {
                    if(err){
                        console.log(err);
                    }

                });
            });

            if ((index+1) == data.length) {

                connection.close();
                deferred.resolve("Successfully Inserted");
            }

        });


    });

    return deferred.promise;

}

function updateInstructions(instructions) {

    var deferred = q.defer();

    var updateQuery = "Update tasks_supreme set task_l = ?,task_r = ?, task_i = ?,process_l = ?, process_r = ?";
    updateQuery += ",process_i = ?, picture_l=?,picture_r = ?, picture_i = ?,measurement_l = ?, measurement_r = ?";
    updateQuery += ",measurement_i = ?, timeTaken=?,tools_l = ?,tools_r=?,tools_i=?,inference_l = ?,inference_r=?";
    updateQuery += ",inference_i = ?,version=? where id = ? and status = ?";

    for(var i = 0 ; i < instructions.length; i++){
        var updateQueryDetails = mysql.format(updateQuery,[instructions[i].task_l,instructions[i].task_r,instructions[i].task_i
            ,instructions[i].process_l,instructions[i].process_r,instructions[i].process_i,instructions[i].picture_l
            ,instructions[i].picture_r,instructions[i].picture_i,instructions[i].measurement_l,instructions[i].measurement_r
            ,instructions[i].measurement_i,instructions[i].timeTaken,instructions[i].tools_l,instructions[i].tools_r
            ,instructions[i].tools_i,instructions[i].inference_l,instructions[i].inference_r,instructions[i].inference_i
            ,instructions[i].version,instructions[i].id,'active']);
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

    var query = 'Update tasks_supreme set '+selectedField+' = "'+fileName+'"';
    query += ' where id = '+id+' and status = "active"';

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

function deleteSingleInstruction(data,cb) {

    var query = '';
    var taskID = 0;
    var taskModeVar = '';
    if(data.userMode ==  'I'){
        taskModeVar = 'taskId_i';
        taskID = data.ins.taskId_i;
        query = "Update tasks_supreme set flag_i = ?,inference_i = ?";
        query += ",measurement_i = ?,picture_i = ?,process_i = ?";
        query += ",taskId_i = ?, task_i = ?, tools_i = ? where";
        query += " version = ? and status = ? and id = ?";
    }else if(data.userMode ==  'LT'){
        taskModeVar = 'taskId_l';
        taskID = data.ins.taskId_l;
        query = "Update tasks_supreme set flag_l = ?,inference_l = ?";
        query += ",measurement_l = ?,picture_l = ?,process_l = ?";
        query += ",taskId_l = ?, task_l = ?, tools_l = ? where";
        query += " version = ? and status = ? and id = ?";
    }else if(data.userMode ==  'RT'){
        taskModeVar = 'taskId_r';
        taskID = data.ins.taskId_r;
        query = "Update tasks_supreme set flag_r = ?,inference_r = ?";
        query += ",measurement_r = ?,picture_r = ?,process_r = ?";
        query += ",taskId_r = ?, task_r = ?, tools_r = ? where";
        query += " version = ? and status = ? and id = ?";
    }

    var updateQuery = mysql.format(query,[null,null,null,null,null,null,null,null,
        data.ins.version,'active',data.ins.id]);

    con.query(updateQuery,function (error,results) {

        if(error){
            cb(error,results);
        }

        query = "Update tasks_supreme set "+taskModeVar+" = "+taskModeVar+"-1 where version = ";
        query += ""+data.ins.version+"  and status = 'active' and "+taskModeVar+" > "+taskID;

        con.query(query,function (err,rslt) {

            if(err){
                cb(err,rslt);
            }

            cb(err,rslt);

        });


    });


}

function deleteEntireInstruction(data,cb) {
    var query = '';
    var taskId_i = data.taskId_i;
    var taskId_l = data.taskId_l;
    var taskId_r = data.taskId_r;
    var taskModeVar = '';
    query = "Update tasks_supreme set status = 'Mark as deleted',taskId_i = 0,taskId_r = 0,taskId_l = 0 where id = "+data.id;
    query += " and status = 'active'";
    con.query(query,function (error,results) {

        if(error){
            cb(error,results);
        }

        query = "Update tasks_supreme set taskId_i= taskId_i-1 where version = ";
        query += ""+data.version+"  and status = 'active' and taskId_i > "+taskId_i;

        con.query(query,function (err,rslt) {

            if(err){
                cb(err,rslt);
            }

            query = "Update tasks_supreme set taskId_r= taskId_r-1 where version = ";
            query += ""+data.version+"  and status = 'active' and taskId_r > "+taskId_r;
            con.query(query,function (er,rsl) {

                if(er){
                    cb(er,rsl);
                }

                query = "Update tasks_supreme set taskId_l= taskId_l-1 where version = ";
                query += ""+data.version+"  and status = 'active' and taskId_l > "+taskId_l;
                con.query(query,function (e,rs) {

                    if(e){
                        cb(e,rs);
                    }

                    cb(e,rs);

                });

            });
        });


    });


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

            if(data.flag == 'I') {
                query = "select t.id,t.task_i as task,t.taskId_i as taskId,t.process_i as process,";
                query += "t.picture_i as picture,t.flag_i as flag,t.tools_i as tools,t.timeTaken,";
                query += "t.inference_i as inference,t.measurement_i as measurement";
                query += " from serviceworkcheck as t where t.taskId_i = "+(result[0].IFlag + 1);
            }else if(data.flag == 'R') {
                query = "select t.id,t.task_r as task,t.taskId_r as taskId,t.process_r as process,";
                query += "t.picture_r as picture,t.flag_r as flag,t.tools_r as tools,t.timeTaken,";
                query += "t.inference_r as inference,t.measurement_r as measurement";
                query += " from serviceworkcheck as t where t.taskId_r = "+(result[0].RFlag + 1);
            }else if(data.flag == 'L') {
                query = "select t.id,t.task_l as task,t.taskId_l as taskId,t.process_l as process,";
                query += "t.picture_l as picture,t.flag_l as flag,t.tools_l as tools,t.timeTaken,";
                query += "t.inference_l as inference,t.measurement_l as measurement";
                query += " from serviceworkcheck as t where t.taskId_l = "+(result[0].LFlag + 1);
            }

            con.query(query,function (err,rslt) {

                if(err){
                    return deferred.reject(err);
                }

                deferred.resolve(rslt);

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
    query += ' and s.modelId = m.id and t.serviceId = '+data.serviceId+' and t.status = "active"';

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

module.exports = {
    updateInstructionData: updateInstructionData,
    getInstructionData: getInstructionData,
    updateImages:updateImages,
    updateInstructions:updateInstructions,
    getInstructions:getInstructions,
    updateWorkCheckInstructions:updateWorkCheckInstructions,
    deleteSingleInstruction:deleteSingleInstruction,
    deleteEntireInstruction:deleteEntireInstruction,
    updateTaskFin:updateTaskFin,
    updateTaskFinTable:updateTaskFinTable,
    deleteTaskFin:deleteTaskFin
};
