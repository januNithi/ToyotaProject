/**
 * Created by CSS on 26-09-2016.
 */
var mysql = require('mysql');
var q = require('q');
var db = require('./../db');
var sqlDb = require('./../sqlDb');

var sql = require('mssql');

var fs = require('fs');
var con = mysql.createConnection(db);

function updateInstructionData(data,service,model,picArr) {
    var deferred = q.defer();

    var tempTask_i = "";
    var tempTask_r = "";
    var tempTask_l = "";

    var r = 1;
    var l = 1;
    var I = 1;

    var version = 1;

    var qry = "Select DISTINCT version from toyota_tasks_supreme where service = '"+service+"' and model = '"+model+"'";
    qry += " and status = 'active'";

    var connection = new sql.Connection(sqlDb);
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        var ps = new sql.PreparedStatement(connection);
        request.query(qry).then(function (recordset) {
            console.log(recordset);

            if(recordset && recordset.length > 0){

                version = recordset[0].version;

                qry = "Update toyota_tasks_supreme set status = 'Mark as Deleted' where version = "+version+"";
                qry += " and service = '"+service+"' and model = '"+ model+"' and status = 'active'";


                version = Number(version)+1;

                request.query(qry,function (results,error) {

                    if(error){
                        connection.close();
                        console.log("Error1---->In updateInstructionsData"+error);
                        return deferred.reject(error);
                    }


                    data.forEach(function (value,index) {

                        if(index > 4){

                            if(data[index][2] !== "" || data[index][10] !== "" || data[index][18] !== "" ||
                                data[index][3] !== "" || data[index][11] !== "" || data[index][19] !== "" ||
                                data[index][2] !== " " || data[index][10] !== " " || data[index][18] !== " " ||
                                data[index][3] !== " " || data[index][11] !== " " || data[index][19] !== " ") {

                                var taskrId = null;
                                var tasklId = null;
                                var taskiId = null;

                                var picture_l = null;
                                var picture_r = null;
                                var picture_i = null;

                                if (data[index][2] !== "" && data[index][2] !== " ") {
                                    tempTask_r = data[index][2];
                                    taskrId = r;
                                    r++;
                                } else {
                                    if (data[index][3] != " " && tempTask_r != "" && data[index][3] != "") {
                                        data[index][2] = tempTask_r;
                                        taskrId = r - 1;
                                    }
                                }

                                if (data[index][10] !== "" && data[index][10] !== " ") {
                                    tempTask_i = data[index][10];
                                    taskiId = I;
                                    I++;
                                } else {
                                    if (data[index][11] != "" && data[index][11] != " "  && tempTask_i != "") {
                                        data[index][10] = tempTask_i;
                                        taskiId = I - 1;
                                    }
                                }

                                if (data[index][18] !== "" && data[index][18] !== " ") {
                                    tempTask_l = data[index][18];
                                    tasklId = l;
                                    l++;
                                } else {
                                    if (data[index][19] != "" && data[index][19] != " "  && tempTask_l != "") {
                                        data[index][18] = tempTask_l;
                                        tasklId = l - 1;
                                    }
                                }

                                var dataUpdate = 'Insert into toyota_tasks_supreme(service,model,taskId_l,taskId_r,taskId_i,task_l,task_r,task_i,';
                                dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,Iflag_r,Rflag_r,Iflag_i,Lflag_l,Iflag_l,';
                                dataUpdate += 'measurement_l,measurement_r,measurement_i,value_r,value_i,value_l,';
                                dataUpdate += 'tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,status)';
                                dataUpdate += ' values(@service,@model,@taskId_l,@taskId_r,@taskId_i,@task_l,@task_r,@task_i,';
                                dataUpdate += '@process_l,@process_r,@process_i,@picture_l,@picture_r,@picture_i,@Iflag_r,@Rflag_r,@Iflag_i,@Lflag_l,@Iflag_l,';
                                dataUpdate += '@measurement_l,@measurement_r,@measurement_i,@value_r,@value_i,@value_l,';
                                dataUpdate += '@tools_l,@tools_r,@tools_i,@inference_l,@inference_r,@inference_i,@version,@status)';


                                console.log('Query template' + dataUpdate);

                                // if(data[index][18] == ''){
                                //     data[index][18] = null;
                                // }
                                // if(data[index][19] == ''){
                                //     data[index][19] = null;
                                // }
                                // if(data[index][20] == ''){
                                //     data[index][20] = null;
                                // }
                                // if(data[index][21] == ''){
                                //     data[index][21] = null;
                                // }
                                // if(data[index][23] == ''){
                                //     data[index][23] = null;
                                // }
                                // if(data[index][2] == ''){
                                //     data[index][2] = null;
                                // }
                                // if(data[index][3] == ''){
                                //     data[index][3] = null;
                                // }
                                // if(data[index][4] == ''){
                                //     data[index][4] = null;
                                // }
                                // if(data[index][5] == ''){
                                //     data[index][5] = null;
                                // }
                                // if(data[index][7] == ''){
                                //     data[index][7] = null;
                                // }
                                // if(data[index][10] == ''){
                                //     data[index][10] = null;
                                // }
                                // if(data[index][11] == ''){
                                //     data[index][11] = null;
                                // }
                                // if(data[index][12] == ''){
                                //     data[index][12] = null;
                                // }
                                // if(data[index][13] == ''){
                                //     data[index][13] = null;
                                // }
                                // if(data[index][15] == ''){
                                //     data[index][15] = null;
                                // }

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
                                        ps.input('Iflag_r',sql.NVarChar);
                                        ps.input('Rflag_r',sql.NVarChar);
                                        ps.input('Iflag_l',sql.NVarChar);
                                        ps.input('Lflag_l',sql.NVarChar);
                                        ps.input('Iflag_i',sql.NVarChar);
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
                                                connection.close();
                                                console.log("Error2---->In updateInstructionsData"+error);
                                            }
                                            ps.execute({service: service,model:model,taskId_l:  tasklId,
                                                taskId_r:  taskrId, taskId_i: taskiId, task_l : data[index][18],
                                                task_r: data[index][2],task_i: data[index][10], process_l: data[index][19],
                                                process_r :  data[index][3], process_i :  data[index][11],
                                                picture_l : picture_l, picture_r : picture_r,picture_i: picture_i,
                                                Iflag_r:'0',Rflag_r:'1',Lflag_l : '1',Iflag_l:'0',Iflag_i : '1',
                                                measurement_l : data[index][20],value_r:'0',value_i:'0',value_l:'0',
                                                measurement_r:data[index][4],measurement_i: data[index][12],
                                                tools_l: data[index][21], tools_r: data[index][5], tools_i : data[index][13],
                                                inference_l : data[index][23],inference_r: data[index][7], inference_i :data[index][15],
                                                version : Number(version), status:'active'}, function (error, results) {
                                                if (error) {
                                                    connection.close();
                                                    console.log("Error3---->In updateInstructions"+error);
                                                    return deferred.reject(error);
                                                }
                                                ps.unprepare(function(err) {
                                                    if(err){
                                                        console.log("Error4---->In updateInstructionsData"+err);

                                                    }

                                                });

                                                if ((index+1) == data.length) {

                                                    deferred.resolve(ps.lastRequest.rowsAffected);
                                                }
                                            });


                                        });


                                    }

                                });

                            }

                        }

                    });


                });

            }else{
                data.forEach(function (value,index) {

                    if(index > 4){

                        if(data[index][2] !== "" || data[index][10] !== "" || data[index][18] !== "" ||
                            data[index][3] !== "" || data[index][11] !== "" || data[index][19] !== "" ||
                            data[index][2] !== " " || data[index][10] !== " " || data[index][18] !== " " ||
                            data[index][3] !== " " || data[index][11] !== " " || data[index][19] !== " ") {

                            var taskrId = null;
                            var tasklId = null;
                            var taskiId = null;

                            var picture_l = null;
                            var picture_r = null;
                            var picture_i = null;

                            if (data[index][2] !== "" && data[index][2] !== " ") {
                                tempTask_r = data[index][2];
                                taskrId = r;
                                r++;
                            } else {
                                if (data[index][3] != " " && tempTask_r != "" && data[index][3] != "") {
                                    data[index][2] = tempTask_r;
                                    taskrId = r - 1;
                                }
                            }

                            if (data[index][10] !== "" && data[index][10] !== " ") {
                                tempTask_i = data[index][10];
                                taskiId = I;
                                I++;
                            } else {
                                if (data[index][11] != "" && data[index][11] != " "  && tempTask_i != "") {
                                    data[index][10] = tempTask_i;
                                    taskiId = I - 1;
                                }
                            }

                            if (data[index][18] !== "" && data[index][18] !== " ") {
                                tempTask_l = data[index][18];
                                tasklId = l;
                                l++;
                            } else {
                                if (data[index][19] != "" && data[index][19] != " "  && tempTask_l != "") {
                                    data[index][18] = tempTask_l;
                                    tasklId = l - 1;
                                }
                            }


                            var dataUpdate = 'Insert into toyota_tasks_supreme(service,model,taskId_l,taskId_r,taskId_i,task_l,task_r,task_i,';
                            dataUpdate += 'process_l,process_r,process_i,picture_l,picture_r,picture_i,Iflag_r,Rflag_r,Iflag_i,Lflag_l,Iflag_l,';
                            dataUpdate += 'measurement_l,measurement_r,measurement_i,value_r,value_i,value_l,';
                            dataUpdate += 'tools_l,tools_r,tools_i,inference_l,inference_r,inference_i,version,status)';
                            dataUpdate += ' values(@service,@model,@taskId_l,@taskId_r,@taskId_i,@task_l,@task_r,@task_i,';
                            dataUpdate += '@process_l,@process_r,@process_i,@picture_l,@picture_r,@picture_i,@Iflag_r,@Rflag_r,@Iflag_i,@Lflag_l,@Iflag_l,';
                            dataUpdate += '@measurement_l,@measurement_r,@measurement_i,@value_r,@value_i,@value_l,';
                            dataUpdate += '@tools_l,@tools_r,@tools_i,@inference_l,@inference_r,@inference_i,@version,@status)';



                            console.log('Query template' + dataUpdate);

                            // if(data[index][18] == ''){
                            //     data[index][18] = null;
                            // }
                            // if(data[index][19] == ''){
                            //     data[index][19] = null;
                            // }
                            // if(data[index][20] == ''){
                            //     data[index][20] = null;
                            // }
                            // if(data[index][21] == ''){
                            //     data[index][21] = null;
                            // }
                            // if(data[index][23] == ''){
                            //     data[index][23] = null;
                            // }
                            // if(data[index][2] == ''){
                            //     data[index][2] = null;
                            // }
                            // if(data[index][3] == ''){
                            //     data[index][3] = null;
                            // }
                            // if(data[index][4] == ''){
                            //     data[index][4] = null;
                            // }
                            // if(data[index][5] == ''){
                            //     data[index][5] = null;
                            // }
                            // if(data[index][7] == ''){
                            //     data[index][7] = null;
                            // }
                            // if(data[index][10] == ''){
                            //     data[index][10] = null;
                            // }
                            // if(data[index][11] == ''){
                            //     data[index][11] = null;
                            // }
                            // if(data[index][12] == ''){
                            //     data[index][12] = null;
                            // }
                            // if(data[index][13] == ''){
                            //     data[index][13] = null;
                            // }
                            // if(data[index][15] == ''){
                            //     data[index][15] = null;
                            // }

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
                                    ps.input('Iflag_r',sql.NVarChar);
                                    ps.input('Rflag_r',sql.NVarChar);
                                    ps.input('Iflag_l',sql.NVarChar);
                                    ps.input('Lflag_l',sql.NVarChar);
                                    ps.input('Iflag_i',sql.NVarChar);
                                    ps.input('measurement_l',sql.NVarChar);
                                    ps.input('measurement_r',sql.NVarChar);
                                    ps.input('measurement_i',sql.NVarChar);
                                    ps.input('tools_l',sql.NVarChar);
                                    ps.input('tools_r',sql.NVarChar);
                                    ps.input('tools_i',sql.NVarChar);
                                    ps.input('inference_l',sql.NVarChar);
                                    ps.input('inference_r',sql.NVarChar);
                                    ps.input('inference_i',sql.NVarChar);
                                    ps.input('value_l',sql.NVarChar);
                                    ps.input('value_r',sql.NVarChar);
                                    ps.input('value_i',sql.NVarChar);
                                    ps.input('version',sql.NVarChar);
                                    ps.input('status',sql.NVarChar);
                                    ps.prepare(dataUpdate, function(err) {
                                        // ... error checks
                                        if(err){
                                            connection.close();
                                            console.log("Error7---->In updateInstructions"+err);
                                            return deferred.reject(err);
                                        }
                                        ps.execute({service: service,model:model,taskId_l:  tasklId,
                                            taskId_r:  taskrId, taskId_i: taskiId, task_l : data[index][18],
                                            task_r: data[index][2],task_i: data[index][10], process_l: data[index][19],
                                            process_r :  data[index][3], process_i :  data[index][11],
                                            picture_l : picture_l, picture_r : picture_r,picture_i: picture_i,
                                            Iflag_r:'0',Rflag_r:'1',Lflag_l : '1',Iflag_l:'0',Iflag_i : '1',
                                            measurement_l : data[index][20],value_r:'0',value_i:'0',value_l:'0',
                                            measurement_r:data[index][4],measurement_i: data[index][12],
                                            tools_l: data[index][21], tools_r: data[index][5], tools_i : data[index][13],
                                            inference_l : data[index][23],inference_r: data[index][7], inference_i :data[index][15],
                                            version : Number(version), status:'active'}, function (error, results) {
                                            if (error) {
                                                console.log("Error8---->In updateInstructionsData"+error);
                                                connection.close();
                                                return deferred.reject(error);
                                            }
                                            ps.unprepare(function(err) {
                                                if(err){
                                                    console.log("Error9---->In updateInstructionsData"+error);

                                                }

                                            });
                                            if ((index+1) == data.length) {

                                                deferred.resolve(ps.lastRequest.rowsAffected);
                                            }
                                        });



                                    });

                                }

                            });

                        }

                    }

                });


            }

        }).catch(function (err) {
            console.log("Error12---->In updateInstructionsData"+err);
            connection.close();
            return deferred.reject(err);
        });
    }).catch(function (err) {
        console.log("Error13---->In updateInstructionsData"+err);
        connection.close();
        return deferred.reject(err);
    });

    return deferred.promise;
}


function updateTaskFin(service,model){

    var deferred = q.defer();

    var tasks = [];

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {

        var request = new sql.Request(connection);
        var query = "Select DISTINCT taskId_r from toyota_tasks_supreme where model = '"+model+"'";
        query += " and service = '"+service+"' and status = 'active' and taskId_r is Not null";
        var ps = new sql.PreparedStatement(connection);
        request.query(query).then(function (recordset,err) {

            if(err){
                connection.close();
                console.log("Error1---->In updateTaskFin"+error);
                return deferred.reject(err);
            }

            if(recordset && recordset.length > 0) {

                var data = recordset;

                data.forEach(function (value, index) {

                    query = "Select taskId_r as Task_id,task_r as Task,service as MType,model as MName";
                    query += ", picture_r as Image, process_r as Process, tools_r as Tools, inference_r";
                    query += " as Inference, value_r as value, Iflag_r as Iflag, Rflag_r as Rflag, timeTaken_r as TTime ";
                    query += " from toyota_tasks_supreme where taskId_r = " + value.taskId_r + " and status = 'active'";
                    query += " and model = '"+model+"' and service = '"+service+"'";

                    request.query(query).then(function (records, err) {

                        if (err) {
                            connection.close();
                            console.log("Error2---->In updateTaskFin"+err);
                            return deferred.reject(err);
                        }
                        if (records && records.length > 0) {

                            var d = records;
                            var data = {};
                            data.Tools= "";
                            data.Process= "";
                            data.Inference= "";
                            data.Image= null;
                            data.Image1= null;
                            data.Image2= null;
                            data.Image3= null;
                            data.Image4= null;
                            data.Image5= null;
                            data.Image6= null;
                            data.value1= 0;
                            data.value2= 0;
                            data.value3= 0;
                            data.value4= 0;
                            data.value5= 0;
                            data.value6= 0;
                            data.TTime= 20;
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
                                    data.Iflag = value1.Iflag;
                                    data.Rflag = value1.Rflag;
                                    data.Image = value1.Image;
                                    data.value1 = value1.value;
                                    if(value1.TTime) {
                                        data.TTime = value1.TTime;
                                    }
                                }

                                if (index1 == 1) {
                                    data.Image1 = value1.Image;
                                    data.value2 = value1.value;
                                }
                                if (index1 == 2) {
                                    data.Image2 = value1.Image;
                                    data.value3 = value1.value;
                                }
                                if (index1 == 3) {
                                    data.Image3 = value1.Image;
                                    data.value4 = value1.value;
                                }
                                if (index1 == 4) {
                                    data.Image4 = value1.Image;
                                    data.value5 = value1.value;
                                }
                                if (index1 == 5) {
                                    data.Image5 = value1.Image;
                                    data.value6 = value1.value;
                                }
                                if (index1 == 6) {
                                    data.Image6 = value1.Image;
                                }

                                data.Tools = '\n'+data.Tools +'\n' + value1.Tools;
                                data.Process ='\n'+ data.Process +'\n'+ value1.Process;
                                data.Inference ='\n'+ data.Inference +'\n'+ value1.Inference;

                                if ((index1 + 1) == d.length) {
                                    tasks.push(data);
                                }
                            });

                        }
                    });

                    if ((index + 1) == data.length) {

                        var query = "Select DISTINCT taskId_i from toyota_tasks_supreme where model = '" + model + "'";
                        query += " and service = '" + service + "' and status = 'active' and taskId_i is Not null";
                        var ps = new sql.PreparedStatement(connection);
                        request.query(query).then(function (recordset, err) {

                            if (err) {
                                connection.close();
                                console.log("Error3---->In updateTaskFin"+err);
                                return deferred.reject(err);
                            }

                            if (recordset && recordset.length > 0) {

                                var data1 = recordset;

                                data1.forEach(function (value2, index2) {

                                    query = "Select taskId_i as Task_id,task_i as Task,service as MType,model as MName";
                                    query += ", picture_i as Image, process_i as Process, tools_i as Tools, inference_i";
                                    query += " as Inference, value_i as value, Iflag_i as Iflag, timeTaken_i as TTime "
                                    query += " from toyota_tasks_supreme where taskId_i = " + value2.taskId_i + " and status = 'active'";
                                    query += " and model = '"+model+"' and service = '"+service+"'";
                                    request.query(query).then(function (records, err) {

                                        if (err) {
                                            connection.close();
                                            console.log("Error4---->In updateTaskFin"+err);
                                            return deferred.reject(err);
                                        }
                                        if (records && records.length > 0) {
                                            var data = {};
                                            data.Tools= "";
                                            data.Process= "";
                                            data.Inference= "";
                                            data.Image= null;
                                            data.Image1= null;
                                            data.Image2= null;
                                            data.Image3= null;
                                            data.Image4= null;
                                            data.Image5= null;
                                            data.Image6= null;
                                            data.value1= 0;
                                            data.value2= 0;
                                            data.value3= 0;
                                            data.value4= 0;
                                            data.value5= 0;
                                            data.value6= 0;
                                            data.TTime= 20;
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
                                                    data.Iflag = value1.Iflag;
                                                    data.Image = value1.Image;
                                                    data.value1 = value1.value;
                                                    if(value1.TTime) {
                                                        data.TTime = value1.TTime;
                                                    }
                                                }

                                                if (index1 == 1) {
                                                    data.Image1 = value1.Image;
                                                    data.value2 = value1.value;
                                                }
                                                if (index1 == 2) {
                                                    data.Image2 = value1.Image;
                                                    data.value3 = value1.value;
                                                }
                                                if (index1 == 3) {
                                                    data.Image3 = value1.Image;
                                                    data.value4 = value1.value;
                                                }
                                                if (index1 == 4) {
                                                    data.Image4 = value1.Image;
                                                    data.value5 = value1.value;
                                                }
                                                if (index1 == 5) {
                                                    data.Image5 = value1.Image;
                                                    data.value6 = value1.value;
                                                }
                                                if (index1 == 6) {
                                                    data.Image6 = value1.Image;
                                                }
                                                data.Tools = '\n'+data.Tools +'\n' + value1.Tools;
                                                data.Process ='\n'+ data.Process +'\n'+ value1.Process;
                                                data.Inference ='\n'+ data.Inference +'\n'+ value1.Inference;

                                                if ((index1 + 1) == records.length) {
                                                    tasks.push(data);
                                                }

                                            });

                                        }

                                    });

                                    if ((index2 + 1) == data1.length) {

                                        var query = "Select DISTINCT" +
                                            " taskId_l from toyota_tasks_supreme where model = '" + model + "'";
                                        query += " and service = '" + service + "' and status = 'active' and taskId_l is Not null";
                                        var ps = new sql.PreparedStatement(connection);
                                        request.query(query).then(function (recordset, err) {

                                            if (err) {
                                                connection.close();
                                                console.log("Error5---->In updateTaskFin"+err);
                                                return deferred.reject(err);
                                            }

                                            if (recordset && recordset.length > 0) {

                                                var data3 = recordset;

                                                data3.forEach(function (value3, index3) {

                                                    query = "Select taskId_l as Task_id,task_l as Task,service as MType,model as MName";
                                                    query += ", picture_l as Image, process_l as Process, tools_l as Tools, inference_l";
                                                    query += " as Inference, value_l as value, Iflag_l as Iflag, Lflag_l as Lflag, timeTaken_l as TTime "
                                                    query += " from toyota_tasks_supreme where taskId_l = " + value3.taskId_l + " and status = 'active'";
                                                    query += " and model = '"+model+"' and service = '"+service+"'";
                                                    request.query(query).then(function (records, err) {

                                                        if (err) {
                                                            connection.close();
                                                            console.log("Error6---->In updateTaskFin"+err);
                                                            return deferred.reject(err);
                                                        }
                                                        if (records && records.length > 0) {
                                                            var data = {};
                                                            data.Tools= "";
                                                            data.Process= "";
                                                            data.Inference= "";
                                                            data.Image= null;
                                                            data.Image1= null;
                                                            data.Image2= null;
                                                            data.Image3= null;
                                                            data.Image4= null;
                                                            data.Image5= null;
                                                            data.Image6= null;
                                                            data.value1= 0;
                                                            data.value2= 0;
                                                            data.value3= 0;
                                                            data.value4= 0;
                                                            data.value5= 0;
                                                            data.value6= 0;
                                                            data.TTime= 20;
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
                                                                    data.Iflag = value1.Iflag;
                                                                    data.Lflag = value1.Lflag;
                                                                    data.Image = value1.Image;
                                                                    data.value1 = value1.value;
                                                                    if(value1.TTime) {
                                                                        data.TTime = value1.TTime;
                                                                    }
                                                                }

                                                                if (index1 == 1) {
                                                                    data.Image1 = value1.Image;
                                                                    data.value2 = value1.value;
                                                                }
                                                                if (index1 == 2) {
                                                                    data.Image2 = value1.Image;
                                                                    data.value3 = value1.value;
                                                                }
                                                                if (index1 == 3) {
                                                                    data.Image3 = value1.Image;
                                                                    data.value4 = value1.value;
                                                                }
                                                                if (index1 == 4) {
                                                                    data.Image4 = value1.Image;
                                                                    data.value5 = value1.value;
                                                                }
                                                                if (index1 == 5) {
                                                                    data.Image5 = value1.Image;
                                                                    data.value6 = value1.value;
                                                                }
                                                                if (index1 == 6) {
                                                                    data.Image6 = value1.Image;
                                                                }

                                                                data.Tools = '\n'+data.Tools +'\n' + value1.Tools;
                                                                data.Process ='\n'+ data.Process +'\n'+ value1.Process;
                                                                data.Inference ='\n'+ data.Inference +'\n'+ value1.Inference;

                                                                if ((index1 + 1) == records.length) {
                                                                    tasks.push(data);
                                                                    if ((index3 + 1) == data3.length) {
                                                                        deferred.resolve(tasks);


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

    }).catch(function (err) {
        console.log("Error8---->In updateTaskFin"+err);
        connection.close();
        return deferred.reject(err);
    });

    return deferred.promise;
}


function deleteTaskFin(service,model){

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        var query = "Delete from Toyota_FINTask where MType = '"+service+"' and MName = '"+model+"'";

        var request = new sql.Request(connection);

        request.query(query,function (records,err) {


            if(err){
                connection.close();
                console.log("Error1---->In deleteTaskFin"+err);
                return deferred.reject(err);
            }
            connection.close();
            deferred.resolve(request.rowsAffected);

        });
    }).catch(function(err){
        connection.close();
        console.log("Error2---->In deleteTaskFin"+err);
        return deferred.reject(err);
    });

    return deferred.promise;

}

function updateTaskFinTable(data) {

    var deferred = q.defer();
    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function() {

        data.forEach(function (value, index) {
            // var request = new sql.Request(connection);
            // request.input('SNo', sql.Int,index+1);
            // request.input('MName', sql.NVarChar,value.MName);
            // request.input('MType', sql.NVarChar,value.MType);
            // request.input('Task_id', sql.NVarChar,value.Task_id);
            // request.input('Task', sql.NVarChar,value.Task);
            // request.input('Type', sql.NVarChar,value.Type);
            // request.input('Process', sql.NVarChar,value.Process);
            // request.input('Tools', sql.NVarChar,value.Tools);
            // request.input('Inference', sql.NVarChar,value.Inference);
            // request.input('Image', sql.NVarChar,value.Image);
            // request.input('Image1', sql.NVarChar,value.Image1);
            // request.input('Image2', sql.NVarChar,value.Image2);
            // request.input('Image3', sql.NVarChar,value.Image3);
            // request.input('Image4', sql.NVarChar,value.Image4);
            // request.input('Image5', sql.NVarChar,value.Image5);
            // request.input('Image6', sql.NVarChar,value.Image6);
            // request.input('value1', sql.NVarChar,value.value1);
            // request.input('value2', sql.NVarChar,value.value2);
            // request.input('value3', sql.NVarChar,value.value3);
            // request.input('value4', sql.NVarChar,value.value4);
            // request.input('value5', sql.NVarChar,value.value5);
            // request.input('value6', sql.NVarChar,value.value6);
            // request.input('TTime', sql.NVarChar,value.TTime);
            // request.input('Rflag', sql.NVarChar,value.Rflag);
            // request.input('Iflag', sql.NVarChar,value.Iflag);
            // request.input('Lflag', sql.NVarChar,value.Lflag);
            // request.execute('UpdateToyota_FINTask', function(err, recordsets, returnValue) {
            //    if(err){
            //        connection.close();
            //        return deferred.reject(err);
            //    }
            //     if ((index + 1) == data.length) {
            //         connection.close();
            //         deferred.resolve(request.rowsAffected);
            //     }
            // });


            var dataUpdate = 'Insert into Toyota_FINTask(MName,MType,Task_id,Task,Type,Process,Tools,Inference,';
            dataUpdate += 'Image,Image1,Image2,Image3,Image4,Image5,Image6,value1,value2,';
            dataUpdate += 'value3,value4,value5,';
            dataUpdate += 'value6,TTime,Rflag,Iflag,Lflag)';
            dataUpdate += ' values(@MName,@MType,@Task_id,@Task,@Type,@Process,@Tools,@Inference,';
            dataUpdate += '@Image,@Image1,@Image2,@Image3,@Image4,@Image5,@Image6,@value1,@value2,';
            dataUpdate += '@value3,@value4,@value5,';
            dataUpdate += '@value6,@TTime,@Rflag,@Iflag,@Lflag)';

            var ps = new sql.PreparedStatement(connection);
            ps.input('MName', sql.NVarChar);
            ps.input('MType', sql.NVarChar);
            ps.input('Task_id', sql.NVarChar);
            ps.input('Task', sql.NVarChar);
            ps.input('Type', sql.NVarChar);
            ps.input('Process', sql.NVarChar);
            ps.input('Tools', sql.NVarChar);
            ps.input('Inference', sql.NVarChar);
            ps.input('Image', sql.NVarChar);
            ps.input('Image1', sql.NVarChar);
            ps.input('Image2', sql.NVarChar);
            ps.input('Image3', sql.NVarChar);
            ps.input('Image4', sql.NVarChar);
            ps.input('Image5', sql.NVarChar);
            ps.input('Image6', sql.NVarChar);
            ps.input('value1', sql.NVarChar);
            ps.input('value2', sql.NVarChar);
            ps.input('value3', sql.NVarChar);
            ps.input('value4', sql.NVarChar);
            ps.input('value5', sql.NVarChar);
            ps.input('value6', sql.NVarChar);
            ps.input('TTime', sql.NVarChar);
            ps.input('Rflag', sql.NVarChar);
            ps.input('Iflag', sql.NVarChar);
            ps.input('Lflag', sql.NVarChar);
            ps.prepare(dataUpdate, function (err) {
                // ... error checks
                if (err) {
                    connection.close();
                    console.log("Error1---->In updateTaskFinTable"+err);
                    return deferred.reject(err);
                }
                ps.execute({
                     MName: value.MName, MType: value.MType, Task_id: value.Task_id, Task: value.Task
                    , Type: value.Type, Process: value.Process, Tools: value.Tools, Inference: value.Inference,
                    Image: value.Image, Image1: value.Image1, Image2: value.Image2, Image3: value.Image3
                    , Image4: value.Image4, Image5: value.Image5, Image6: value.Image6, value1: value.value1
                    , value2: value.value2, value3: value.value3, value4: value.value4, value5: value.value5,
                    value6: value.value6, TTime: value.TTime, Rflag: value.Rflag, Iflag: value.Iflag
                    , Lflag: value.Lflag
                }, function (error, results) {
                    if (error) {
                        console.log("Error2---->In updateTaskFinTable"+error);
                        connection.close();
                        return deferred.reject(error);
                    }
                    ps.unprepare(function (err) {
                        if (err) {
                            console.log("Error3---->In updateTaskFinTable"+err)
                        }

                    });

                    if ((index + 1) == data.length) {
                        connection.close();
                        deferred.resolve(ps.lastRequest.rowsAffected);
                    }
                });


            });


        });

    }).catch(function (err) {

        connection.close();
        return deferred.reject(err);

    });

    return deferred.promise;

}

function updateInstructions(instructions) {

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        var updateQuery = "Update toyota_tasks_supreme set task_l = @task_l,task_r = @task_r, task_i = @task_i,";
        updateQuery += "process_l = @process_l, process_r = @process_r,process_i = @process_i, picture_l = @picture_l";
        updateQuery += ",picture_r = @picture_r, picture_i = @picture_i,measurement_l = @measurement_l,";
        updateQuery += "measurement_r = @measurement_r,measurement_i = @measurement_i";
        updateQuery += ",tools_l = @tools_l,tools_r = @tools_r,tools_i = @tools_i,inference_l = @inference_l,";
        updateQuery += "inference_r = @inference_r,inference_i = @inference_i,value_l=@value_l,";
        updateQuery += "value_r=@value_r,value_i = @value_i,Iflag_r = @Iflag_r, Rflag_r = @Rflag_r, ";
        updateQuery += "timeTaken_r=@timeTaken_r,timeTaken_i = @timeTaken_i,timeTaken_l = @timeTaken_l, ";
        updateQuery += "Iflag_l = @Iflag_l, Lflag_l = @Lflag_l, Iflag_i = @Iflag_i,version=@version where status = @status";
        updateQuery += " and model = @model and service = @service and id=@id";


        var ps = new sql.PreparedStatement(connection)
        ps.input('id',sql.BigInt);
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
        ps.input('Iflag_r',sql.NVarChar);
        ps.input('Rflag_r',sql.NVarChar);
        ps.input('Iflag_l',sql.NVarChar);
        ps.input('Lflag_l',sql.NVarChar);
        ps.input('Iflag_i',sql.NVarChar);
        ps.input('measurement_l',sql.NVarChar);
        ps.input('measurement_r',sql.NVarChar);
        ps.input('measurement_i',sql.NVarChar);
        ps.input('tools_l',sql.NVarChar);
        ps.input('tools_r',sql.NVarChar);
        ps.input('tools_i',sql.NVarChar);
        ps.input('inference_l',sql.NVarChar);
        ps.input('inference_r',sql.NVarChar);
        ps.input('inference_i',sql.NVarChar);
        ps.input('timeTaken_l',sql.NVarChar);
        ps.input('timeTaken_r',sql.NVarChar);
        ps.input('timeTaken_i',sql.NVarChar);
        ps.input('value_l',sql.NVarChar);
        ps.input('value_r',sql.NVarChar);
        ps.input('value_i',sql.NVarChar);
        ps.input('version',sql.NVarChar);
        ps.input('status',sql.NVarChar);

        instructions.forEach(function(value,index){
            ps.prepare(updateQuery, function(err) {
                // ... error checks
                if(err){
                    connection.close();
                    console.log("Error1---->In updateInstructions"+err);
                    return deferred.reject(err);
                }
                ps.execute({id:value.id,task_l:value.task_l,task_r:value.task_r,task_i:value.task_i
                        ,process_l:value.process_l,process_r:value.process_r,process_i:value.process_i,picture_l:value.picture_l
                        ,picture_r:value.picture_r,picture_i:value.picture_i,measurement_l:value.measurement_l,measurement_r:value.measurement_r
                        ,measurement_i:value.measurement_i,tools_l:value.tools_l,tools_r:value.tools_r
                        ,Iflag_r : value.Iflag_r,Rflag_r : value.Rflag_r,Iflag_l : value.Iflag_l, Lflag_l : value.Lflag_l,
                        Iflag_i : value.Iflag_i,timeTaken_r:value.timeTaken_r,timeTaken_l:value.timeTaken_l,timeTaken_i:value.timeTaken_i
                        ,tools_i:value.tools_i,inference_l:value.inference_l,inference_r:value.inference_r,inference_i:value.inference_i
                        ,version:value.version,status:'active',model:value.model,service:value.service,value_l:value.value_l
                        ,value_i:value.value_i,value_r:value.value_r},
                    function (error, results) {
                        if (error) {
                            connection.close();
                            console.log("Error2---->In updateInstructions"+error);
                            return deferred.reject(error);
                        }
                        ps.unprepare(function(err) {
                            if(err){
                                console.log("Error3---->In updateInstructions"+err);
                                return deferred.reject(error);
                            }

                        });
                        if((index+1)==instructions.length){
                            connection.close();

                            deferred.resolve(ps.lastRequest.rowsAffected);

                        }
                    });


            });
        });
    }).catch(function (err) {
        console.log("Error6---->In updateInstructions"+error);
        connection.close();
        return deferred.reject(err);
    });


    return deferred.promise;
}


function updateImages(fileName,id,selectedField){

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        // var request = new sql.Request(connection);

        var file = fs.readFileSync('public/uploads/excelImages/'+fileName);
        var picture= new Buffer(file).toString('base64');

        var query = 'Update toyota_tasks_supreme set '+selectedField+' = @picture';
        query += ' where id = @id and status = @status';

        var ps = new sql.PreparedStatement(connection)
        ps.input('id',sql.BigInt);
        ps.input('picture', sql.NVarChar);
        ps.input('status', sql.NVarChar);

        ps.prepare(query, function(err) {
            // ... error checks
            if (err) {
                connection.close();
                console.log("Error1---->In updateImages" + err);
                return deferred.reject(err);
            }
            ps.execute({id: id, status: "active",picture:picture},
                function (error, results) {
                    if (error) {
                        connection.close();
                        console.log("Error2---->In updateImages" + error);
                        return deferred.reject(error);
                    }
                    ps.unprepare(function (err) {
                        if (err) {
                            console.log("Error3---->In updateImages" + err);
                            return deferred.reject(error);
                        }
                        connection.close();
                        deferred.resolve(ps.lastRequest.rowsAffected);
                    });
                });
        });

        console.log(query);

        // request.query(query,function (results,error) {
        //     if (error) {
        //         console.error(error);
        //         connection.close();
        //         return deferred.reject(error);
        //     }
        //     connection.close();
        //     deferred.resolve(request.rowsAffected);
        // });
    }).catch(function(err){
        console.error(err);
        connection.close();
        return deferred.reject(error);
    });

    return deferred.promise;

}

function deleteSingleInstruction(data) {

    var deferred = q.defer();

    var query = "";
    var taskID = 0;
    var taskModeVar = "";

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {

        var request = new sql.Request(connection);

        var ps = new sql.PreparedStatement(connection);
        ps.input('id',sql.BigInt);
        ps.input('service', sql.NVarChar);
        ps.input('model', sql.NVarChar);
        ps.input('taskId_l', sql.BigInt);
        ps.input('taskId_r', sql.BigInt);
        ps.input('taskId_i', sql.BigInt);
        ps.input('task_l', sql.NVarChar);
        ps.input('task_r', sql.NVarChar);
        ps.input('task_i', sql.NVarChar);
        ps.input('process_l', sql.NVarChar);
        ps.input('process_r', sql.NVarChar);
        ps.input('process_i', sql.NVarChar);
        ps.input('picture_l', sql.NVarChar);
        ps.input('picture_r', sql.NVarChar);
        ps.input('picture_i', sql.NVarChar);
        ps.input('Iflag_r',sql.NVarChar);
        ps.input('Rflag_r',sql.NVarChar);
        ps.input('Iflag_l',sql.NVarChar);
        ps.input('Lflag_l',sql.NVarChar);
        ps.input('Iflag_i',sql.NVarChar);
        ps.input('measurement_l', sql.NVarChar);
        ps.input('measurement_r', sql.NVarChar);
        ps.input('measurement_i', sql.NVarChar);
        ps.input('tools_l', sql.NVarChar);
        ps.input('tools_r', sql.NVarChar);
        ps.input('tools_i', sql.NVarChar);
        ps.input('inference_l', sql.NVarChar);
        ps.input('inference_r', sql.NVarChar);
        ps.input('inference_i', sql.NVarChar);
        ps.input('value_l', sql.NVarChar);
        ps.input('value_i', sql.NVarChar);
        ps.input('value_r', sql.NVarChar);
        ps.input('version', sql.NVarChar);
        ps.input('status', sql.NVarChar);

        if (data.userMode == 'I') {
            taskModeVar = 'taskId_i';
            taskID = data.ins.taskId_i;
            query = "Update toyota_tasks_supreme set Iflag_i = @Iflag_i,inference_i = @inference_i";
            query += ",measurement_i = @measurement_i,picture_i = @picture_i,process_i = @process_i";
            query += ",taskId_i = @taskId_i, task_i = @task_i, tools_i = @tools_i,value_i = @value_i where";
            query += " version = @version and status = @status and taskId_i = @taskId_i and id = @id";
            ps.prepare(query, function (err) {
                // ... error checks
                if (err) {
                    connection.close();
                    console.log("Error1---->In deleteSingleInstructions"+err);
                    return deferred.reject(err);
                }
                ps.execute({
                        id:data.ins.id,Iflag_i: null, inference_i: null, measurement_i: null, picture_i: null
                        , process_i: null, taskId_i: null, task_i: null, tools_i: null,
                        version: data.ins.version, status: 'active', taskId_i: null, value_i:null
                    },
                    function (error, results) {
                        if (error) {
                            connection.close();
                            console.log("Error2---->In deleteSingleInstructions"+error);
                            return deferred.reject(error);
                        }
                        ps.unprepare(function (err) {
                            if (err) {
                                console.log("Error3---->In deleteSingleInstructions"+err);
                                return deferred.reject(err);
                            }

                        });
                        query = "Update toyota_tasks_supreme set taskId_i= taskId_i-1 where version = ";
                        query += ""+data.ins.version+"  and status = 'active' and taskId_i > "+data.ins.taskId_i;

                        request.query(query,function (rslt,err) {

                            if (err) {
                                connection.close();
                                console.log("Error4---->In deleteSingleInstructions"+err);
                                return deferred.reject(err);
                            }
                            connection.close();
                            deferred.resolve(request.rowsAffected);
                        });
                    });


            });
        } else if (data.userMode == 'LT') {
            taskModeVar = 'taskId_l';
            taskID = data.ins.taskId_l;
            query = "Update toyota_tasks_supreme set Lflag_l = @Lflag_l,Iflag_l = @Iflag_l,inference_l = @inference_l";
            query += ",measurement_l = @measurement_l,picture_l = @picture_l,process_l = @process_l";
            query += ",taskId_l = @taskId_l, task_l = @task_l, tools_l = @tools_l, value_l = @value_l where";
            query += " version = @version and status = @status and taskId_l = @taskId_l and id = @id";
            ps.prepare(query, function (err) {
                // ... error checks
                if (err) {
                    connection.close();
                    console.log("Error5---->In deleteSingleInstructions"+err);

                    return deferred.reject(err);
                }
                ps.execute({
                        id:data.ins.id,Iflag_l: null,Lflag_l:null, inference_l: null, measurement_l: null, picture_l: null
                        , process_l: null, taskId_l: null, task_l: null, tools_l: null,
                        version: data.ins.version, status: 'active', taskId_l: null, value_l : null
                    },
                    function (error, results) {
                        if (error) {
                            connection.close();
                            console.log("Error6---->In deleteSingleInstructions"+error);
                            return deferred.reject(error);
                        }
                        ps.unprepare(function (err) {
                            if (err) {
                                console.log("Error7---->In deleteSingleInstructions"+err);

                                return deferred.reject(err);
                            }

                        });
                        query = "Update toyota_tasks_supreme set taskId_l= taskId_l-1 where version = ";
                        query += ""+data.ins.version+"  and status = 'active' and taskId_l > "+data.ins.taskId_l;

                        request.query(query,function (rslt,err) {

                            if (err) {
                                connection.close();
                                console.log("Error8---->In deleteSingleInstructions"+err);
                                return deferred.reject(err);
                            }

                            connection.close();

                            deferred.resolve(request.rowsAffected);

                        });
                    });


            });
        } else if (data.userMode == 'RT') {
            taskModeVar = 'taskId_r';
            taskID = data.ins.taskId_r;
            query = "Update toyota_tasks_supreme set Iflag_r = @Iflag_r,Rflag_r = @Rflag_l,inference_r = @inference_r";
            query += ",measurement_r = @measurement_r,picture_r = @picture_r,process_r = @process_r";
            query += ",taskId_r = @taskId_r, task_r = @task_r, tools_r = @tools_r, value_r = @value_r where";
            query += " version = @version and status = @status and taskId_r = @taskId_r and id = @id";
            ps.prepare(query, function (err) {
                // ... error checks
                if (err) {
                    connection.close();
                    console.log("Error9---->In deleteSingleInstructions"+err);
                    return deferred.reject(err);
                }
                ps.execute({
                        id:data.ins.id,Iflag_r: null,Rflag_r : null, inference_r: null, measurement_r: null, picture_r: null
                        , process_r: null, taskId_r: null, task_r: null, tools_r: null,
                        version: data.ins.version, status: 'active', taskId_r: null, value_r : null
                    },
                    function (error, results) {
                        if (error) {
                            console.log("Error10---->In deleteSingleInstructions"+error);
                            connection.close();
                            return deferred.reject(error);
                        }
                        ps.unprepare(function (err) {
                            if (err) {
                                console.log("Error11---->In deleteSingleInstructions"+err);
                                return deferred.reject(err);
                            }

                        });

                        query = "Update toyota_tasks_supreme set taskId_r= taskId_r-1 where version = ";
                        query += ""+data.ins.version+"  and status = 'active' and taskId_r > "+data.ins.taskId_r;

                        request.query(query,function (rslt,err) {

                            if (err) {
                                connection.close();
                                console.log("Error12---->In deleteSingleInstructions"+err);
                                return deferred.reject(err);
                            }

                            connection.close();
                            deferred.resolve(reques.rowsAffected);

                        });
                    });


            });
        }
    }).catch(function(err){
        connection.close();
        console.log("Error13---->In deleteSingleInstructions"+err);
        return deferred.reject(err);
    });


    return deferred.promise;

}

function deleteEntireInstruction(data) {

    var deferred = q.defer();

    var query = "";
    var taskId_i = data.taskId_i;
    var taskId_l = data.taskId_l;
    var taskId_r = data.taskId_r;

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        var request = new sql.Request(connection);

        query = "Update toyota_tasks_supreme set status = 'Mark as deleted',taskId_i = 0,taskId_r = 0,taskId_l = 0";
        query += " where model = '"+data.model+"' and service = '"+data.service+"' and id = "+data.id;
        query += " and status = 'active'";
        request.query(query,function (results,error) {

            if(error){
                connection.close();
                console.log("Error1---->In deleteEntireInstructions"+error);
                return deferred.reject(error);
            }

            query = "Update toyota_tasks_supreme set taskId_i= taskId_i-1 where version = ";
            query += ""+data.version+"  and status = 'active' and taskId_i > "+taskId_i;

            console.log(query);

            request.query(query,function (rslt,err) {

                if(err){
                    connection.close();
                    console.log("Error2---->In deleteEntireInstructions"+err);
                    return deferred.reject(err);
                }

                query = "Update toyota_tasks_supreme set taskId_r= taskId_r-1 where version = ";
                query += ""+data.version+"  and status = 'active' and taskId_r > "+taskId_r;

                console.log(query);

                request.query(query,function (rsl,er) {

                    if(er){
                        connection.close();
                        console.log("Error3---->In deleteEntireInstructions"+er);
                        return deferred.reject(er);
                    }

                    query = "Update toyota_tasks_supreme set taskId_l= taskId_l-1 where version = ";
                    query += ""+data.version+"  and status = 'active' and taskId_l > "+taskId_l;

                    console.log(query);

                    request.query(query,function (recordset,error) {

                        if(error){
                            connection.close();
                            console.log("Error4---->In deleteEntireInstructions"+error);
                            return deferred.reject(error);
                        }
                        connection.close();
                        deferred.resolve(request.rowsAffected);

                    });

                });
            });


        });
    }).catch(function (err) {

        connection.close();
        console.log("Error5---->In deleteEntireInstructions"+err);
        return deferred.reject(err);

    });

    return deferred.promise;


}

function getInstructionData(data) {
    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        var query = "Select t.id,t.service,t.taskId_l,t.taskId_r,t.taskId_i,t.task_r, t.task_i,";
        query += "t.task_l, t.process_r,t.process_i,t.process_l,";
        query += "t.picture_r,t.picture_i,t.picture_l,t.Iflag_r,t.Rflag_r,t.Iflag_i,t.Lflag_l,t.Iflag_l,t.tools_r,t.tools_i,t.tools_l,";
        query += "t.inference_r,t.inference_i,t.inference_l,t.measurement_r,t.measurement_i,t.measurement_l,";
        query += "(select MName from Toyota_Measures where Mid = t.value_r) as add_value_r,t.value_r,";
        query += "(select MName from Toyota_Measures where Mid = t.value_l) as add_value_l,t.value_l,";
        query += "(select MName from Toyota_Measures where Mid = t.value_i) as add_value_i,t.value_i,t.version";
        query += ",t.timeTaken_r,t.timeTaken_l,t.timeTaken_i";
        query += ",t.model as model from toyota_tasks_supreme as t ";
        query += " where t.model = '"+data.modelId+"' and t.service = '"+data.serviceId+"' and t.status = 'active'";
        query += " order by id ASC";

        // var query = 'Select id,serviceId,taskId,task_r, task_i, task_l, process_r,process_i,process_l,';
        // query += 'picture_r,picture_i,picture_l,flag_r,flag_i,flag_l,tools_r,tools_i,tools_l,';
        // query += 'timeTaken,inference_r,inference_i,inference_l,measurement_r,measurement_i,measurement_l,version';
        // query += ',s.service as service,m.modelName as model from tasks_h,service_type as s,model as m where s.id = serviceId';
        // query += " and s.modelId = m.id";

        var request = new sql.Request(connection);

        console.log(query);
        request.query(query, function(error, results) {
            if (error) {
                console.log("Error1---->In getInstructionData"+error);
                connection.close();
                return deferred.reject(error);
            }
            results.forEach(function(value,index){

                value.isEdit = false;

                if((index + 1) == results.length){

                    connection.close();
                    deferred.resolve(results);
                }

            });
        });

    }).catch(function (err) {
        connection.close();
        console.log("Error2---->In getInstructionData"+error);
        return deferred.reject(err);
    });


    return deferred.promise;
}

function updateAdditional(data){

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {

        var ps = new sql.PreparedStatement(connection);
        ps.input('Aid',sql.BigInt);
        ps.input('Additional', sql.NVarChar);
        ps.input('Purpose', sql.NVarChar);
        ps.input('Employee', sql.NVarChar);
        ps.input('Flag', sql.BigInt);
        ps.input('Date', sql.DATETIME);

        if(data.Aid) {

            query = "Update Toyota_Additional set Additional = @Additional,Purpose = @Purpose";
            query += ",Employee = @Employee,Flag = @Flag,Date = @Date where Aid = @Aid";
            ps.prepare(query, function (err) {
                // ... error checks
                if (err) {
                    connection.close();
                    console.log("Error1---->In updateAdditional"+error);

                    return deferred.reject(err);
                }
                ps.execute({
                        Aid: data.Aid, Additional: data.Additional, Purpose: data.Purpose
                        , Employee: data.Employee, Flag: data.Flag, Date: new Date()
                    },
                    function (error, results) {
                        if (error) {
                            connection.close();
                            console.log("Error2---->In updateAdditional"+error);
                            return deferred.reject(err);
                        }
                        ps.unprepare(function (err) {
                            if (err) {
                                console.log("Error3---->In updateAdditional"+err);
                                return deferred.reject(err);
                            }

                        });
                        connection.close();
                        deferred.resolve(ps.lastRequest.rowsAffected);
                    });
            });

        }else{

            query = "Insert into Toyota_Additional(Additional,Purpose,Employee,Flag,Date) values";
            query += "(@Additional,@Purpose,@Employee,@Flag,@Date)";


            ps.prepare(query, function (err) {
                // ... error checks
                if (err) {
                    connection.close();
                    console.log("Error4---->In updateAdditional"+err);

                    return deferred.reject(err);
                }
                ps.execute({
                        Additional: data.Additional, Purpose: data.Purpose
                        , Employee: data.Employee, Flag: data.Flag, Date: new Date()
                    },
                    function (error, results) {
                        if (error) {
                            connection.close();
                            console.log("Error5---->In updateAdditional"+error);
                            return deferred.reject(err);
                        }
                        ps.unprepare(function (err) {
                            if (err) {
                                console.log("Error6---->In updateAdditional"+err);

                                return deferred.reject(err);
                            }

                        });
                        deferred.resolve(ps.lastRequest.rowsAffected);
                    });
            });

        }

    }).catch(function (err) {
        connection.close();
        console.log("Error7---->In updateAdditional"+err);
        return deferred.reject(err);
    });

    return deferred.promise;

}

function updateMeasure(data){

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {

        var ps = new sql.PreparedStatement(connection);
        ps.input('Mid',sql.BigInt);
        ps.input('MName', sql.NVarChar);
        ps.input('Start', sql.Float);
        ps.input('start1', sql.Float);
        ps.input('Assigned', sql.NVarChar);
        ps.input('Flag', sql.NVarChar);
        ps.input('Units', sql.NVarChar);

        if(data.Mid) {

            query = "Update Toyota_Measures set MName = @MName,Start = @Start";
            query += ",start1 = @start1,Assigned = @Assigned,Flag = @Flag,Units = @Units where Mid = @Mid";
            ps.prepare(query, function (err) {
                // ... error checks
                if (err) {
                    connection.close();
                    console.log("Error1---->In updateMeasure"+error);

                    return deferred.reject(err);
                }
                ps.execute({
                        MName:data.MName,Start:data.Start,start1:data.start1,
                        Assigned:data.Assigned,Flag:data.Flag,Units:data.Units,Mid:data.Mid
                    },
                    function (error, results) {
                        if (error) {
                            connection.close();
                            console.log("Error2---->In updateMeasure"+error);
                            return deferred.reject(err);
                        }
                        ps.unprepare(function (err) {
                            if (err) {
                                console.log("Error3---->In updateMeasure"+err);
                                return deferred.reject(err);
                            }

                        });
                        connection.close();
                        deferred.resolve(ps.lastRequest.rowsAffected);
                    });
            });

        }else{

            query = "Insert into Toyota_Measures(MName,Start,start1,Assigned,Flag,Units) values";
            query += "(@MName,@Start,@start1,@Assigned,@Flag,@Units)";


            ps.prepare(query, function (err) {
                // ... error checks
                if (err) {
                    connection.close();
                    console.log("Error4---->In updateMeasure"+err);

                    return deferred.reject(err);
                }
                ps.execute({
                        MName:data.MName,Start:data.Start,start1:data.start1,
                        Assigned:data.Assigned,Flag:data.Flag,Units:data.Units
                    },
                    function (error, results) {
                        if (error) {
                            connection.close();
                            console.log("Error5---->In updateMeasure"+error);
                            return deferred.reject(err);
                        }
                        ps.unprepare(function (err) {
                            if (err) {
                                console.log("Error6---->In updateMeasure"+err);

                                return deferred.reject(err);
                            }

                        });
                        deferred.resolve(ps.lastRequest.rowsAffected);
                    });
            });

        }

    }).catch(function (err) {
        connection.close();
        console.log("Error7---->In updateMeasure"+err);
        return deferred.reject(err);
    });

    return deferred.promise;

}


function getWorkCompleted(serviceId) {

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        // var query = "Select t.Mid,t.MType,t.Tid,t.Task,t.Type,";
        // query += "t.RSummary,t.ISummary,t.LSummary,t.values6,t.Additional,t.Status,";
        // query += "t.value,(select MName from Toyota_Measures where Mid = t.value) as value_name,";
        // query += "(select Start from Toyota_Measures where Mid = t.value) as value_Start,";
        // query += "(select start1 from Toyota_Measures where Mid = t.value) as value_start1,";
        // query += "t.values1,(select MName from Toyota_Measures where Mid = t.value1) as value1_name,";
        // query += "(select Start from Toyota_Measures where Mid = t.value1) as value1_Start,";
        // query += "(select start1 from Toyota_Measures where Mid = t.value1) as value1_start1,";
        // query += "t.values2,(select MName from Toyota_Measures where Mid = t.value2) as value2_name,";
        // query += "(select Start from Toyota_Measures where Mid = t.value2) as value2_Start,";
        // query += "(select start1 from Toyota_Measures where Mid = t.value2) as value2_start1,";
        // query += "t.values3,(select MName from Toyota_Measures where Mid = t.value3) as value3_name,";
        // query += "(select Start from Toyota_Measures where Mid = t.value3) as value3_Start,";
        // query += "(select start1 from Toyota_Measures where Mid = t.value3) as value3_start1,";
        // query += "t.values4,(select MName from Toyota_Measures where Mid = t.value4) as value4_name,";
        // query += "(select Start from Toyota_Measures where Mid = t.value4) as value4_Start,";
        // query += "(select start1 from Toyota_Measures where Mid = t.value4) as value4_start1,";
        // query += "t.values5,(select MName from Toyota_Measures where Mid = t.value5) as value5_name,";
        // query += "(select Start from Toyota_Measures where Mid = t.value5) as value5_Start,";
        // query += "(select start1 from Toyota_Measures where Mid = t.value5) as value5_start1,";
        // query += "t.values6,(select MName from Toyota_Measures where Mid = t.value6) as value6_name,";
        // query += "(select Start from Toyota_Measures where Mid = t.value6) as value6_Start,";
        // query += "(select start1 from Toyota_Measures where Mid = t.value6) as value6_start1 ";
        // query += "from Toyota_FINWorkcheck as t where t.Status = 'Completed' and t.Sid = '"+serviceId+"'";


        // var query = "Select t.Tid as Task_Id,t.Task,t.Type as userMode,";
        // query += " t.RSummary,t.ISummary,t.LSummary,t.values6 as cameraCapture,t.Additional,t.Status,";
        // query += "t.[values] as value,(select MName + ':' + Cast(Start as nvarchar(max)) + '-' +";
        // query += "Cast(start1 as nvarchar(max)) from Toyota_Measures where Mid = t.value)  as value1_Start_End,";
        // query += "t.values1,(select MName + ':' + Cast(Start as nvarchar(max)) + '-' + Cast(start1 as nvarchar(max)) from ";
        // query += "Toyota_Measures where Mid = t.value1) as value2_Start_End,";
        // query  += "t.values2,(select MName + ':' + Cast(Start as nvarchar(max)) + '-' + Cast(start1 as nvarchar(max)) from ";
        // query += "Toyota_Measures where Mid = t.value2) as value3_Start_End,";
        // query += "t.values3,(select MName + ':' + Cast(Start as nvarchar(max)) + '-' + Cast(start1 as nvarchar(max)) from ";
        // query += "Toyota_Measures where Mid = t.value3) as value4_Start_End,";
        // query += "t.values4,(select MName + ':' + Cast(Start as nvarchar(max)) + '-' + Cast(start1 as nvarchar(max)) from ";
        // query += "Toyota_Measures where Mid = t.value4) as value5_Start_End,";
        // query += "t.values5,(select MName + ':' + Cast(Start as nvarchar(max)) + '-' + Cast(start1 as nvarchar(max)) from ";
        // query += "Toyota_Measures where Mid = t.value5) as value6_Start_End,";
        // query += "t.values6,(select MName + ':' + Cast(Start as nvarchar(max)) + '-' + Cast(start1 as nvarchar(max)) from ";
        // query += "Toyota_Measures where Mid = t.value6) as value7_Start_End ";
        // query += "from Toyota_FINWorkcheck as t where t.Sid = '"+serviceId+"'";
        // (select value from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value != '0' and Type = t.Type) as Standard_Value, (select value1 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value1 != '0' and Type = t.Type) as Standard_Value, (select value2 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value2 != '0' and Type = t.Type) as Standard_Value, (select value3 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value3 !='0' and Type = t.Type) as Standard_Value, (select value4 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value4 != '0' and Type = t.Type) as Standard_Value, (select value5 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value5 != '0' and Type = t.Type) as Standard_Value,
        // var query = "Select t.Tid as Task_id, t.Task,t.Type,(select m.MName from Toyota_Measures as m left join Toyota_FINWorkcheck on value1 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value1 != '0' and Type = t.Type) as Measurement, (select m.MName from Toyota_Measures as m left join Toyota_FINWorkcheck on value2 = m.Mid where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value2 != '0' and Type = t.Type) as Measurement, (select m.MName from Toyota_Measures as m left join Toyota_FINWorkcheck on value3 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value3 != '0' and Type = t.Type) as Measurement, (select m.MName from Toyota_Measures as m left join Toyota_FINWorkcheck on value4 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value4 !='0' and Type = t.Type) as Measurement, (select m.MName from Toyota_Measures as m left join Toyota_FINWorkcheck on value5 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value5 != '0' and Type = t.Type) as Measurement, (select m.MName from Toyota_Measures as m left join Toyota_FINWorkcheck on value6 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value6 != '0' and Type = t.Type) as Measurement,(select Cast(m.Start as nvarchar(max)) + '-' + Cast(m.start1 as nvarchar(max)) from Toyota_Measures as m left join Toyota_FINWorkcheck on value1 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value1 != '0' and Type = t.Type) as Standard_Value, (select Cast(m.Start as nvarchar(max)) + '-' + Cast(m.start1 as nvarchar(max)) from Toyota_Measures as m left join Toyota_FINWorkcheck on value2 = m.Mid where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value2 != '0' and Type = t.Type) as Standard_Value, (select Cast(m.Start as nvarchar(max)) + '-' + Cast(m.start1 as nvarchar(max)) from Toyota_Measures as m left join Toyota_FINWorkcheck on value3 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value3 != '0' and Type = t.Type) as Standard_Value, (select Cast(m.Start as nvarchar(max)) + '-' + Cast(m.start1 as nvarchar(max)) from Toyota_Measures as m left join Toyota_FINWorkcheck on value4 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value4 !='0' and Type = t.Type) as Standard_Value, (select Cast(m.Start as nvarchar(max)) + '-' + Cast(m.start1 as nvarchar(max)) from Toyota_Measures as m left join Toyota_FINWorkcheck on value5 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value5 != '0' and Type = t.Type) as Standard_Value, (select Cast(m.Start as nvarchar(max)) + '-' + Cast(m.start1 as nvarchar(max)) from Toyota_Measures as m left join Toyota_FINWorkcheck on value6 = m.Mid  where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and value6 != '0' and Type = t.Type) as Standard_Value, (select [values] from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and [values]!= '0' and Type = t.Type) as Concluded_Value, (select values1 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and values1 != '0' and Type = t.Type) as Concluded_Value, (select values2 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and values2 != '0' and Type = t.Type) as Concluded_Value, (select values3 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and values3 != '0' and Type = t.Type) as Concluded_Value, (select values4 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and values4 !='0' and Type = t.Type) as Concluded_Value, (select values5 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and values5 != '0' and Type = t.Type) as Concluded_Value,(select RSummary from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and RSummary != '0' and Type = t.Type) as QC,(select Lsummary from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and Lsummary != '0' and Type = t.Type) as QC,(select Isummary from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and Isummary != '0' and Type = t.Type) as QC, (select values6 from Toyota_FINWorkcheck where Tid = t.Tid and Sid = '"+serviceId+"'";
        // query += " and values6 ! = '0' and Type = t.Type) as Captured_Picture, t.Status,t.Additional from Toyota_FINWorkcheck as t where Sid = '"+serviceId+"'";
        // query += " and ((Isummary != '0' OR RSummary != '0' OR Lsummary != '0') OR (value1 != '0' OR value2 != '0' OR value3 != '0' OR value4 != '0'";
        // query += " OR value5 != '0' OR value6 != '0'))";

        var query = "Select t.Tid as Task_id, t.Task,t.Type,(select m.MName from Toyota_Measures as m where t.value1 = m.Mid)";
        query += " as Measurement,(select m.MName from Toyota_Measures as m where t.value2 = m.Mid) as Measurement,";
        query += " (select m.MName from Toyota_Measures as m where t.value3 = m.Mid) as Measurement,";
        query += " (select m.MName from Toyota_Measures as m where t.value4 = m.Mid) as Measurement,";
        query += " (select m.MName from Toyota_Measures as m where t.value5 = m.Mid) as Measurement,";
        query += " (select m.MName from Toyota_Measures as m where t.value6 = m.Mid) as Measurement,";
        query += " (select Cast(m.Start as nvarchar(max)) + '-' + Cast(m.start1 as nvarchar(max)) from";
        query += " Toyota_Measures as m where t.value1 = m.Mid) as Standard_Value, (select Cast(m.Start as nvarchar(max)) + '-' +";
        query += " Cast(m.start1 as nvarchar(max)) from Toyota_Measures as m where t.value2 = m.Mid) as Standard_Value,";
        query += " (select Cast(m.Start as nvarchar(max)) + '-' + Cast(m.start1 as nvarchar(max)) from";
        query += " Toyota_Measures as m where t.value3 = m.Mid) as Standard_Value, (select Cast(m.Start as nvarchar(max)) + '-' +";
        query += " Cast(m.start1 as nvarchar(max)) from Toyota_Measures as m where t.value4 = m.Mid) as Standard_Value,";
        query += " (select Cast(m.Start as nvarchar(max)) + '-' + Cast(m.start1 as nvarchar(max)) from";
        query += " Toyota_Measures as m where t.value5 = m.Mid) as Standard_Value, (select Cast(m.Start as nvarchar(max)) + '-' +";
        query += " Cast(m.start1 as nvarchar(max)) from Toyota_Measures as m where t.value6 = m.Mid) as Standard_Value,";
        query += " t.[values] as Concluded_Value,t.values1 as Concluded_Value,t.values2 as Concluded_Value, t.values3";
        query += " as Concluded_Value,t.values4 as Concluded_Value,t.values5 as Concluded_Value,t.RSummary as QC,t.Lsummary as QC,";
        query += " t.Isummary  as QC, t.values6 as Captured_Picture, t.Status,t.Additional";
        query += " from Toyota_FINWorkcheck as t where Sid = '"+serviceId+"' and ((Isummary != '0' OR RSummary != '0' OR Lsummary != '0') OR";
        query += " (value1 != '0' OR value2 != '0' OR value3 != '0' OR value4 != '0' OR value5 != '0' OR value6 != '0'))";

        var request = new sql.Request(connection);

        console.log(query);
        request.query(query, function(error, results) {
            if (error) {
                console.log("Error1---->In getWorkCompleted"+error);
                connection.close();
                return deferred.reject(error);
            }

            var data = [];
            results.forEach(function (value,index) {
                var meas = [];
                var conclu = [];
                var standa = [];
                var QC = '';
                if(value.Measurement != null) {

                    if (value.Measurement[0] != null && value.Measurement[0] != null) {
                        meas.push(value.Measurement[0]);
                    }
                    if (value.Measurement[1] != null && value.Measurement[1] != null) {
                        meas.push(value.Measurement[1]);
                    }
                    if (value.Measurement[2] != null && value.Measurement[2] != null) {
                        meas.push(value.Measurement[2]);
                    }
                    if (value.Measurement[3] != null && value.Measurement[3] != null) {
                        meas.push(value.Measurement[3]);
                    }
                    if (value.Measurement[4] != null && value.Measurement[4] != null) {
                        meas.push(value.Measurement[4]);
                    }
                    if (value.Measurement[5] != null && value.Measurement[5] != null) {
                        meas.push(value.Measurement[5]);
                    }
                }

                if(value.Standard_Value != null) {
                    if (value.Standard_Value[0] != "" && value.Standard_Value[0] != 0) {
                        standa.push(value.Standard_Value[0]);
                    }
                    if (value.Standard_Value[1] != "" && value.Standard_Value[1] != 0) {
                        standa.push(value.Standard_Value[1]);
                    }
                    if (value.Standard_Value[2] != "" && value.Standard_Value[2] != 0) {
                        standa.push(value.Standard_Value[2]);
                    }
                    if (value.Standard_Value[3] != "" && value.Standard_Value[3] != 0) {
                        standa.push(value.Standard_Value[3]);
                    }
                    if (value.Standard_Value[4] != "" && value.Standard_Value[4] != 0) {
                        standa.push(value.Standard_Value[4]);
                    }
                    if (value.Standard_Value[5] != "" && value.Standard_Value[5] != 0) {
                        standa.push(value.Standard_Value[5]);
                    }
                }

                if(value.Concluded_Value != null) {
                    if (value.Concluded_Value[0] != "" && value.Concluded_Value[0] != 0) {
                        conclu.push(value.Concluded_Value[0]);
                    }
                    if (value.Concluded_Value[1] != "" && value.Concluded_Value[1] != 0) {
                        conclu.push(value.Concluded_Value[1]);
                    }
                    if (value.Concluded_Value[2] != "" && value.Concluded_Value[2] != 0) {
                        conclu.push(value.Concluded_Value[2]);
                    }
                    if (value.Concluded_Value[3] != "" && value.Concluded_Value[3] != 0) {
                        conclu.push(value.Concluded_Value[3]);
                    }
                    if (value.Concluded_Value[4] != "" && value.Concluded_Value[4] != 0) {
                        conclu.push(value.Concluded_Value[4]);
                    }
                    if (value.Concluded_Value[5] != "" && value.Concluded_Value[5] != 0) {
                        conclu.push(value.Concluded_Value[5]);
                    }
                }
                if(value.QC != null) {
                    if(value.QC.length <= 3){
                        if (value.QC[0] != null && value.QC[0] != 0) {
                            QC = value.QC[0];
                        }
                        if (value.QC[1] != null && value.QC[1] != 0) {
                            QC = value.QC[1];
                        }
                        if (value.QC[2] != null && value.QC[2] != 0) {
                            QC = value.QC[2];
                        }
                    }else{
                        QC = value.QC;
                    }

                }

                if(conclu.length || standa.length || meas.length || QC.length) {
                    var obj = {
                        Task_id: value.Task_id,
                        Task: value.Task,
                        Type: value.Type,
                        Measurement: meas,
                        Standard_Value: standa,
                        Concluded_Value: conclu,
                        QC: QC,
                        Status: value.Status,
                        Captured_Picture : value.Captured_Picture
                    }
                    data.push(obj);

                }
                if((index +1) == results.length){

                    connection.close();
                    deferred.resolve(data);
                }
            });

        });

    }).catch(function (err) {
        connection.close();
        console.log("Error2---->In getWorkCompleted"+error);
        return deferred.reject(err);
    });

    return deferred.promise;

}

function deleteMeasure(data) {

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        var query = "Delete from Toyota_Measures where Mid = '"+data.Mid+"'";

        var request = new sql.Request(connection);

        request.query(query,function (records,err) {


            if(err){
                connection.close();
                console.log("Error1---->In deleteMeasure"+err);
                return deferred.reject(err);
            }
            connection.close();
            deferred.resolve(request.rowsAffected);

        });
    }).catch(function(err){
        connection.close();
        console.log("Error2---->In deleteMeasure"+err);
        return deferred.reject(err);
    });

    return deferred.promise;
}

function deleteAdditional(data) {

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        var query = "Delete from Toyota_Additional where Aid = '"+data.Aid+"'";

        var request = new sql.Request(connection);

        request.query(query,function (records,err) {


            if(err){
                connection.close();
                console.log("Error1---->In deleteAdditional"+err);
                return deferred.reject(err);
            }
            connection.close();
            deferred.resolve(request.rowsAffected);

        });
    }).catch(function(err){
        connection.close();
        console.log("Error2---->In deleteAdditional"+err);
        return deferred.reject(err);
    });

    return deferred.promise;
}

function getAdditional(){

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        var query = "Select Aid,Additional,Purpose,Employee,Flag,Date from Toyota_Additional";
        var request = new sql.Request(connection);

        console.log(query);
        request.query(query, function(error, results) {
            if (error) {
                console.log("Error1---->In getAdditional"+error);
                connection.close();
                return deferred.reject(error);
            }
            connection.close();
            deferred.resolve(results);
        });

    }).catch(function (err) {
        connection.close();
        console.log("Error2---->In getAdditional"+error);
        return deferred.reject(err);
    });

    return deferred.promise;

}

function getMeasures(modelType){

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);
    var query = '';
    connection.connect().then(function () {
        if(modelType == 'ALL'){
            query = "Select Mid,MName,Start,start1,Assigned,Flag,Units from Toyota_Measures";
        }else {
            query = "Select Mid,MName,Start,start1,Assigned,Flag,Units from Toyota_Measures where Assigned = '" + modelType + "'";
        }
        var request = new sql.Request(connection);

        console.log(query);
        request.query(query, function(error, results) {
            if (error) {
                console.log("Error1---->In getMeasures"+error);
                connection.close();
                return deferred.reject(error);
            }
            connection.close();
            deferred.resolve(results);
        });

    }).catch(function (err) {
        connection.close();
        console.log("Error2---->In getMeasures"+error);
        return deferred.reject(err);
    });

    return deferred.promise;

}


function getRegisteredService(){

    var deferred = q.defer();

    var connection = new sql.Connection(sqlDb);

    connection.connect().then(function () {
        var query = "Select Sid,Mid,Addno,MType,SDate as date,DATEDIFF(mi,SDate,EDate) as time from Toyota_FINRegister where Status = 'Completed' ORDER BY YEAR(SDate) DESC, MONTH(SDate) DESC, DAY(SDATE) DESC";
        var request = new sql.Request(connection);

        console.log(query);
        request.query(query, function(error, results) {
            if (error) {
                console.log("Error1---->In getRegisteredService"+error);
                connection.close();
                return deferred.reject(error);
            }
            connection.close();
            deferred.resolve(results);
        });

    }).catch(function (err) {
        connection.close();
        console.log("Error2---->In getRegisteredService"+error);
        return deferred.reject(err);
    });

    return deferred.promise;

}


module.exports = {
    updateInstructionData: updateInstructionData,
    getInstructionData: getInstructionData,
    updateImages:updateImages,
    updateInstructions:updateInstructions,
    deleteSingleInstruction:deleteSingleInstruction,
    deleteEntireInstruction:deleteEntireInstruction,
    updateTaskFin:updateTaskFin,
    updateTaskFinTable:updateTaskFinTable,
    deleteTaskFin:deleteTaskFin,
    getAdditional:getAdditional,
    updateAdditional:updateAdditional,
    deleteAdditional:deleteAdditional,
    getWorkCompleted:getWorkCompleted,
    getMeasures:getMeasures,
    updateMeasure:updateMeasure,
    deleteMeasure:deleteMeasure,
    getRegisteredService:getRegisteredService
};
