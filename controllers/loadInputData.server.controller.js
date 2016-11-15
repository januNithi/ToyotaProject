/**
 * Created by CSS on 26-07-2016.
 */

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
        cb(null, 'excel-'+req.query.model+"-"+req.query.service+"."+file.originalname.split('.')[1]);
        //
        var path = "public/uploads/"+'excel-'+req.query.model+"-"+req.query.service+"."+file.originalname.split('.')[1];
       
        var picArr;

        var exec = require('child_process').exec;
        var child = exec('java -jar ./javaLib/jar/excelJar.jar ' +req.query.model+" "+req.query.service,
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
                            storageManager.updateInstructionData(records,req.query.service,req.query.model,picArr).then(function () {

                                storageManager.deleteTaskFin(req.query.service,req.query.model).then(function (result,error) {

                                    storageManager.updateTaskFin(req.query.service,req.query.model).then(function (result,error) {
                                        if(error){
                                           console.log(error);
                                        }
                                        storageManager.updateTaskFinTable(result);
                                    });
                                });

                            });

                        });
                    }
                });

            });
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
        storageManager.updateImages(fileName,req.query.id,req.query.selectedField).then(function () {

            storageManager.deleteTaskFin(req.query.service,req.query.model).then(function (result,error) {

                storageManager.updateTaskFin(req.query.service,req.query.model).then(function (result,error) {
                    if(error){
                        console.log(error);
                    }
                    storageManager.updateTaskFinTable(result);
                });
            });

        });
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

exports.updateTaskFin = function(req,res){
    storageManager.deleteTaskFin(req.query.service,req.query.model).then(function (result,error) {

        if(error){
            res.send(500,{ error: error });
        }

        storageManager.updateTaskFin(req.query.service,req.query.model).then(function (result,error) {
            if(error){
                res.send(500,{error:error});
            }
            storageManager.updateTaskFinTable(result).then(function (result) {
                res.send(result);
            },function (error) {
                res.send(500,{error:error});
            });
        });
    });
};

exports.uploadImages = function (req,res) {

    uploadImage(req,res,function () {
       res.send('Success');
    });


};

exports.deleteSingleInstruction = function (req,res) {
    storageManager.deleteSingleInstruction(req.body).then(function (result) {
        storageManager.deleteTaskFin(req.body[0].service,req.body[0].model).then(function (result,error) {

            if(error){
                res.send(500,{error:error});
            }

            storageManager.updateTaskFin(req.body[0].service,req.body[0].model).then(function (result,error) {
                if(error){
                    res.send(500,{error:error});
                }
                res.send(result);
            });

        });
    },function (error) {
        res.send(500,{error:error});
    });
};

exports.deleteEntireInstruction = function (req,res) {
    storageManager.deleteEntireInstruction(req.body).then(function (result) {
        storageManager.deleteTaskFin(req.body[0].service,req.body[0].model).then(function (result,error) {

            if(error){
                res.send(500,{error:error});
            }

            storageManager.updateTaskFin(req.body[0].service,req.body[0].model).then(function (result,error) {
                if(error){
                    res.send(500,{error:error});
                }
                res.send(result);
            });

        });
    },function (error) {
        res.send(500,{error:error});
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

exports.getWorkCompleted = function (req,res) {

    storageManager.getWorkCompleted(req.query.serviceId).then(function (result) {

        res.send(result);

    },function (error) {
        res.send(500,{error:error});
    });
    
};

exports.getMeasures = function (req,res) {

    storageManager.getMeasures(req.query.modelType).then(function (result) {

        res.send(result);

    },function (error) {
        res.send(500,{error:error});
    });

};

exports.getRegisteredService = function (req,res) {

    storageManager.getRegisteredService().then(function (result) {

        res.send(result);

    },function (error) {
        res.send(500,{error:error});
    });

};


exports.getAdditionalData = function (req,res) {

    storageManager.getAdditional().then(function (result) {

        res.send(result);

    },function (error) {
        res.send(500,{error:error});
    });

};

exports.deleteAdditionals = function (req,res) {

    storageManager.deleteAdditional(req.body).then(function (result) {
        res.send(result);
    },function (error) {
        res.send(500,{error:error});
    });

};

exports.updateAdditionals = function (req,res) {
    storageManager.updateAdditional(req.body).then(function (result) {
        res.send(result);
    },function (error) {
        res.send(500,{error:error});
    });
};


exports.deleteMeasure = function (req,res) {

    storageManager.deleteMeasure(req.body).then(function (result) {
        res.send(result);
    },function (error) {
        res.send(500,{error:error});
    });

};

exports.updateMeasure = function (req,res) {
    storageManager.updateMeasure(req.body).then(function (result) {
        res.send(result);
    },function (error) {
        res.send(500,{error:error});
    });
};


exports.updateInstructions = function (req,res) {

    storageManager.updateInstructions(req.body).then(function (result) {
        storageManager.deleteTaskFin(req.body[0].service,req.body[0].model).then(function (result,error) {

            storageManager.updateTaskFin(req.body[0].service,req.body[0].model).then(function (result,error) {
                if(error){
                    console.log(error);
                }
                storageManager.updateTaskFinTable(result);
            });
        });
        res.send(result);
    },function (error) {
        res.send(500,{error:error});
    });

};