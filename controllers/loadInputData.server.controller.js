/**
 * Created by CSS on 26-07-2016.
 */

// var XLSX = require('xlsx');

var multer = require('multer');

var storageManager = require("../config/db/loadInputDataManager");

var q = require('q');

var fs = require('fs');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        console.log("req.body"+req.body.file);
        // cb(null, file.fieldname + '-' + file.originalname);
        cb(null, 'excel-'+req.query.serviceId+"."+file.originalname.split('.')[1]);
        //
        var path = "public/uploads/"+file.fieldname + "-" + file.originalname;
       
        // var excel = require('excel-stream');
        // var fs = require('fs');
        //
        // req.session.data = [];
        //
        // fs.createReadStream(path)
        //     .pipe(excel())  // same as excel({sheetIndex: 0})
        //     .on('data', function(result){
        //         req.session.data.push(result);
        //         console.log(result);
        //     });

        var picArr;

        var exec = require('child_process').exec;
        var child = exec('java -jar ./javaLib/jar/excelJar.jar ' +req.query.serviceId,
            function (error, stdout, stderr){
                console.log('Output -> ' + stdout);
                picArr = stdout.split("\r\n");
                if(error !== null){
                    console.log("Error -> "+error);
                }
                var excelParser = require('excel-parser');
                excelParser.worksheets({
                    inFile: path
                }, function(err, worksheets){
                    if(err) console.error(err);
                    console.log(worksheets);
                    for(var i = 1 ; i <= worksheets.length; i++){
                        excelParser.parse({
                            inFile: path,
                            worksheet: i
                        },function(err, records){
                            if(err) console.error(err);
                            console.log(records);
                            var data = {
                                serviceId : req.query.serviceId
                            }
                            req.session.data = data;
                            storageManager.updateInstructionData(records,req.query.serviceId,picArr);
                        });
                    }
                });

            });



        // var Excel = require('exceljs');
        //
        // var workbook = new Excel.Workbook();
        // workbook.xlsx.readFile(path)
        //     .then(function(result) {
        //         for(var i = 1 ; i <= result._worksheets.length; i++){
        //             var worksheet = result._worksheets[i];
        //             if(worksheet) {
        //                 worksheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
        //                     console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
        //                 });
        //             }
        //         }
        //
        //     },function(error){
        //         console.log(error);
        //     });

        // EXCEl EXTRACT
        // var XLSX = require('xlsx-extract').XLSX;
        // //convert to json-file (sheet info is not written to file)
        // new XLSX().convert(path,'new.json')
        //     .on('error', function (err) {
        //         console.error(err);
        //     })
        //     .on('end', function () {
        //         console.log('written');
        //     })
    }
});


var imageStorage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/excelImages');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        console.log("req.body"+req.body.file);
        var fileName = req.query.id + '-' + file.fieldname + '-' + file.originalname;
        cb(null, fileName);
        //
        storageManager.updateImages(fileName,req.query.id,req.query.selectedField);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).array('file');


var uploadImage = multer({ //multer settings
    storage: imageStorage
}).array('file');



exports.loadInputData = function (req,res) {


    upload(req,res,function(){
        // res.send(req.session.data);
        res.send("Success");
    });


};

exports.getInputData = function(req,res){

    storageManager.getInstructionData(req.query).then(function(result){
        if(req.session.data && req.session.data.serviceId){
            req.session.data.serviceId = 0;
        }
        res.send(result);
    },function(error){
        res.send(500,{ error: error });
    });
    
};

exports.uploadImages = function (req,res) {

    uploadImage(req,res,function () {
        storageManager.getInstructionData().then(function (result){
           res.send(result);
        });
    });


};

exports.deleteSingleInstruction = function (req,res) {
    storageManager.deleteSingleInstruction(req.body,function (result) {

    });
};

exports.deleteEntireInstruction = function (req,res) {
    storageManager.deleteEntireInstruction(req.body,function (result) {

    });
};

exports.getInstruction = function(req,res){

    storageManager.getInstructions(req.query).then(function(result){
        if(result && result.length > 0) {
            for(var i = 0 ; i < result.length; i++){
                var bitmap = fs.readFileSync('public/uploads/excelImages/'+result[0].picture);
                // convert binary data to base64 encoded string
                result[0].picture = new Buffer(bitmap).toString('base64');
                if((i+1) == result.length){
                    res.send(result);
                }
            }
        }

    },function (error) {
        res.send(500,{error:error});
    });

};

exports.updateInstructions = function (req,res) {

    storageManager.updateInstructions(req.body).then(function (result) {
        res.send(result);
    });

};