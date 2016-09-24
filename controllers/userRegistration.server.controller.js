

var storageManager = require("../config/db/userRegistrationManager");

exports.getEmployeeRegDetails = function(req,res) {

    storageManager.getEmployeeRegDetails().then(function (results) {
        res.send(results);
    });


};

exports.updateEmployeeRegDetails=function(req,res) {

    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    var selectedFiles, datas = {};
    form.parse(req, function (err, fields, files) {

        selectedFiles = files.file;
        if(selectedFiles!=undefined)
        {

            var file = selectedFiles.path;
            console.log(selectedFiles);
            var fs = require('fs');
            var bitmap = fs.readFileSync(file);
            var encode = new Buffer(bitmap).toString('base64');
            datas.encode = encode;
        }
        else{
            datas.encode=fields.Photo;

        }

        datas.DMI_NO=fields.DMI_NO;
        datas.Name = fields.Name;
        datas.Designation = fields.Designation;
        datas.Username = fields.Username;
        datas.Password = fields.Password;
        datas.Bay_No = fields.Bay_No;
        datas.Flag = fields.Flag;
        datas.Date = fields.Date;
       

        console.log(datas);



        storageManager.updateEmployeeRegDetails(datas).then(function (result) {
            res.send(result);
        });

    });
};

exports.saveNewEmployeeRegDetails=function (req,res) {


    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    var selectedFile, data={};
    // userId=req.body.id.slice();

    form.parse(req, function (err, fields, files) {
        selectedFile = files.file;

        if(selectedFile!=undefined)
        {

            var file = selectedFile.path;
            console.log(selectedFile);
            var fs = require('fs');
            var bitmap = fs.readFileSync(file);
            var encode = new Buffer(bitmap).toString('base64');
            data.encode = encode;
        }
        else{
            data.encode=fields.Photo;

        }


        data.Name = fields.Name;
        data.Designation = fields.Designation;
        data.Username = fields.Username;
        data.Password = fields.Password;
        data.Bay_No = fields.Bay_No;
        data.Flag = fields.Flag;
        data.Photo=fields.Photo;
        if(fields.id) {
            data.id = fields.id;
        }

    storageManager.NewEmployeeRegDetails(data).then(function(result){
        res.send(result);
    });
    });
};


exports.deleteEmployeeDetails = function (req,res) {
    storageManager.deleteEmployeeDetails(req.body).then(function (result,err) {
        res.send(result);


    });
};