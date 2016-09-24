var mysql = require('mysql');
var q = require('q');
var db = require('./../db');
var sqlDb = require('./../sqlDb');

var sql = require('mssql');

var fs = require('fs');
var con = mysql.createConnection(db);


console.log();

function jobRegistration(){

    var deferred=q.defer();


    var query = "select Sid,Mid,MType,VMilege,VNo,Bayno from Toyota_FINRegister order by Sid ASC";
    console.log(query);
    var connection = new sql.Connection(sqlDb);
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.query(query,function(err,result){



            if(err){

                deferred.reject(err);

            }
            else   {

                for(i=0;i<result.length;i++){

                    result[i].isEdit =false;


                    if((i + 1) == result.length){

                        deferred.resolve(result);
                    }

                }

            }

        });
    });

    return deferred.promise;
}



function updateJobRegistration(data){

    var deferred=q.defer();
    var query = "UPDATE Toyota_FINRegister SET Sid = '"+data.Sid+"',Mid='"+data.Mid+"',MType='"+data.MType+"',VMilege='"+data.VMilege+"',VNo='"+data.VNo+"',Bayno='"+data.Bayno+"' WHERE Sid = '"+data.Sid+"'";
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


function saveNewJobRegistration(data){

    var deferred=q.defer();
    var query = "INSERT INTO Toyota_FINRegister(Sid,Mid,MType,VMilege,VNo,Bayno) VALUES('"+data.OrderCode+"','"+data.choosenModel+"','"+data.choosenService+"','"+data.VehicleMilege+"','"+data.Vehicle_No+"','"+data.Bay_No+"')";
    console.log(query);
    var connection = new sql.Connection(sqlDb);
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.query(query,function(result,err){




            if(err){

                return  deferred.reject(err);

            }
            else   {


                deferred.resolve(result);

            }

        });
    });

    return deferred.promise;

}

function deleteJobRegistration(data){

    var deferred=q.defer();

    var query = "delete from Toyota_FINRegister where Sid='"+data.Sid+"'";
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


    jobRegistration:jobRegistration,
    updateJobRegistration:updateJobRegistration,
    saveNewJobRegistration:saveNewJobRegistration,
    deleteJobRegistration:deleteJobRegistration
    // updateEmployeeRegDeatails:updateEmployeeRegDeatails,
    // NewEmployeeRegDeatails:NewEmployeeRegDeatails,
    // deleteEmployeeDeatails:deleteEmployeeDeatails


};