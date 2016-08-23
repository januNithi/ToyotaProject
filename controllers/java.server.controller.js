/**
 * Created by CSS on 22-08-2016.
 */

var javaInit = require("./javaInit.server.controller.js");
var java = javaInit.getJavaInstance();

var HSSFSheet = java.import('org.apache.poi.hssf.usermodel.HSSFSheet');
var File = java.import('java.io.File');
var FileInputStream = java.import('java.io.FileInputStream');
var WorkBook = java.import('org.apache.poi.ss.usermodel.Workbook');
var WorkBookFactory = java.import('org.apache.poi.ss.usermodel.WorkbookFactory');

exports.getImages = function (req,res) {

    var workbook = WorkBookFactory.create(new
        FileInputStream(new File("./public/uploads/file-Innova 40K & 10K SOP Final.xls")),function(result,error){
        console.log("result"+result);
        console.log("error"+error);
    });

    console.log(workbook);
};