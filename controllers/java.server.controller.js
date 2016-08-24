/**
 * Created by CSS on 22-08-2016.
 */


exports.getImages = function (req,res) {
var pic = [];
    var exec = require('child_process').exec;
    var child = exec('java -jar ./javaLib/jar/excelJar.jar',
        function (error, stdout, stderr){
            console.log('Output -> ' + stdout);
            pic = stdout.split("\r\n");
            if(error !== null){
                console.log("Error -> "+error);
            }

        });

};