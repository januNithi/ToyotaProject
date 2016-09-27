var mysql = require('mysql');
var q = require('q');
var db = require('./../db');
var sqlDb = require('./../sqlDb');

var sql = require('mssql');

var fs = require('fs');
var con = mysql.createConnection(db);


console.log();

function getEmployeeRegDetails(){

    var deferred=q.defer();

    var query = "select id,DMI_No,Name,Designation,Photo,Username,Password,Bay_No,Flag,Date from Toyota_Employee order by DMI_No ASC ";
    console.log(query);
    var connection = new sql.Connection(sqlDb);
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.query(query,function(err,result){
            
            if(err) {
                connection.close();
                return deferred.reject(err);
            }else{
                connection.close();
                deferred.resolve(result);
            }

        });
    });

    return deferred.promise;
}


function updateEmployeeRegDetails(data){

    // var my_date= new Date().toISOString().slice(0, 19).replace('T', ' ');
    //
    // var deferred=q.defer();
    // var query = "UPDATE Toyota_Employee SET DMI_No = '"+data.DMI_NO+"',Name='"+data.Name+"',Designation='"+data.Designation+"',Photo='"+data.encode+"',Username='"+data.Username+"',Password='"+data.Password+"',Bay_No='"+data.Bay_No+"',Flag='"+data.Flag+"',Date='"+my_date+"' WHERE DMI_No = '"+data.DMI_NO+"'";
    // console.log(query);
    // var connection = new sql.Connection(sqlDb);
    // connection.connect().then(function () {
    //     var request = new sql.Request(connection);
    //
    //     request.query(query,function(result,err){
    //         console.log("err"+err);
    //         console.log("result"+result);
    //
    //
    //         if(err){
    //
    //             deferred.reject(err);
    //
    //         }
    //         else   {
    //
    //
    //                     deferred.resolve(result);
    //
    //         }
    //
    //     });
    // });
    //
    // return deferred.promise;

    }

function NewEmployeeRegDetails(data){

    var deferred=q.defer();

    if(data.id) {
        var my_date= new Date().toISOString().slice(0, 19).replace('T', ' ');
        var deferred=q.defer();
        var query = "UPDATE Toyota_Employee SET DMI_No = '"+data.DMI_No+"',Name='"+data.Name+"',Designation='"+data.Designation+"',Photo='";
        query += data.encode+"',Username='"+data.Username+"',Password='"+data.Password+"',Bay_No='";
        query += data.Bay_No+"',Flag='"+data.Flag+"',Date='"+my_date+"' WHERE id = "+data.id
        console.log(query);
        var connection = new sql.Connection(sqlDb);
        connection.connect().then(function () {
            var request = new sql.Request(connection);

            request.query(query,function(result,err){
                console.log("err"+err);
                console.log("result"+result);


                if(err){

                    deferred.reject(err);

                }
                else   {


                    deferred.resolve(result);

                }

            });
        });

        return deferred.promise;


    }

    else {
        var my_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        console.log(my_date);
        var query = "INSERT INTO Toyota_Employee (DMI_No,Name,Designation,Photo,Username,Password,Bay_No,Flag,Date) VALUES('"+data.DMI_No+"','" + data.Name + "','" + data.Designation + "','" + data.encode + "','" + data.Username + "','" + data.Password + "','" + data.Bay_No + "','" + data.Flag + "','" + my_date + "')";
        console.log(query);
        var connection = new sql.Connection(sqlDb);
        connection.connect().then(function () {
            var request = new sql.Request(connection);

            request.query(query, function (result, err) {


                if (err) {

                    return deferred.reject(err);

                }
                else {


                    deferred.resolve(result);

                }

            });
        });

        return deferred.promise;
    }
}


function deleteEmployeeDetails(Empdetails){

    var deferred=q.defer();

    var query = "delete from Toyota_Employee where DMI_No='"+Empdetails.data+"'";
    console.log(query);
    var connection = new sql.Connection(sqlDb);
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.query(query,function(affected,err) {


            if(err){
                connection.close();
                return deferred.reject(err);


            }
            else   {
                connection.close();
                deferred.resolve(request.rowsAffected);

            }

        });


        });
    return deferred.promise;


}



module.exports={


    getEmployeeRegDetails:getEmployeeRegDetails,
    updateEmployeeRegDetails:updateEmployeeRegDetails,
    NewEmployeeRegDetails:NewEmployeeRegDetails,
    deleteEmployeeDetails:deleteEmployeeDetails


};