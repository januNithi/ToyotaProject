/**
 * Created by CSS on 21-09-2016.
 */


var json2xls = require('json2xls');

var PDFDocument = require('pdfkit');

var blobStream  = require('blob-stream');

var fs = require('fs');

exports.reportGeneration = function (req,res) {

    var data = [];
    var pictures = [];

    req.body.forEach(function (value,index) {

        var meas = [];
        var conclu = [];
        var standa = [];

        if(value.Measurement != null) {

            if (value.Measurement[0] != null) {
                meas.push(value.Measurement[0]);
            }
            if (value.Measurement[1] != null) {
                meas.push(value.Measurement[1]);
            }
            if (value.Measurement[2] != null) {
                meas.push(value.Measurement[2]);
            }
            if (value.Measurement[3] != null) {
                meas.push(value.Measurement[3]);
            }
            if (value.Measurement[4] != null) {
                meas.push(value.Measurement[4]);
            }
            if (value.Measurement[5] != null) {
                meas.push(value.Measurement[5]);
            }
        }

        if(value.Standard_Value != null) {
            if (value.Standard_Value[0] != "") {
                standa.push(value.Standard_Value[0]);
            }
            if (value.Standard_Value[1] != "") {
                standa.push(value.Standard_Value[1]);
            }
            if (value.Standard_Value[2] != "") {
                standa.push(value.Standard_Value[2]);
            }
            if (value.Standard_Value[3] != "") {
                standa.push(value.Standard_Value[3]);
            }
            if (value.Standard_Value[4] != "") {
                standa.push(value.Standard_Value[4]);
            }
            if (value.Standard_Value[5] != "") {
                standa.push(value.Standard_Value[5]);
            }
        }

        if(value.Concluded_Value != null) {
            if (value.Concluded_Value[0] != "") {
                conclu.push(value.Concluded_Value[0]);
            }
            if (value.Concluded_Value[1] != "") {
                conclu.push(value.Concluded_Value[1]);
            }
            if (value.Concluded_Value[2] != "") {
                conclu.push(value.Concluded_Value[2]);
            }
            if (value.Concluded_Value[3] != "") {
                conclu.push(value.Concluded_Value[3]);
            }
            if (value.Concluded_Value[4] != "") {
                conclu.push(value.Concluded_Value[4]);
            }
            if (value.Concluded_Value[5] != "") {
                conclu.push(value.Concluded_Value[5]);
            }
        }

        if(conclu.length || standa.length || meas.length) {
            var obj = {
                Task_id: value.Task_id,
                Task: value.Task,
                User_Mode: value.Type,
                Measurement: meas,
                Standard_Value: standa,
                Concluded_Value: conclu,
                QC: value.QC,
                Status: value.Status
            }
            data.push(obj);
        }
        pictures.push(value.Captured_Picture);
        if((index+1) == req.body.length){
            var xls = json2xls(data);

            fs.writeFileSync('public/uploads/data.xlsx', xls, 'binary');

                if(value != null) {
                    var exec = require('child_process').exec;
                    var child = exec('java -jar ./javaLib/jar/excelImageLoad.jar ' + './public/uploads/excelImages/file-sample1.jpg' + ' ' + index,
                        function (error, stdout, stderr) {
                            console.log('Output -> ' + stdout);
                            if (error !== null) {
                                console.log("Error -> " + error);
                            }
                            res.end()
                        });
                }

                // if((index+1) == pictures.length ) {
                //     res.download(__dirname + "/../public/uploads/data.xlsx", 'data.xlsx', function (err, result) {
                //         if (err) {
                //             // Handle error, but keep in mind the response may be partially-sent
                //             // so check res.headersSent
                //         } else {
                //             res.end();
                //         }
                //     });
                // }
            }

    });


};

exports.deleteFile = function (req,res) {
    // fs.unlink('public/uploads/data.xlsx');
    res.end();
}

exports.pdfGeneration = function (req,res) {

//     // create a document and pipe to a blob
//     var doc = new PDFDocument();
//     var stream = doc.pipe(blobStream());
//     doc.pipe(fs.createWriteStream('public/uploads/output.pdf'));
//
//     var x = 50;
//
// // draw some text
//     doc.fontSize(12)
//         .text('ServiceID : '+req.body.serviceId+'          Model : '+req.body[0].Mid+'              Service Type : '+req.body[0].MType, 50, x);
//
//     x += 50;
//
// // some vector graphics
//     doc.save()
//         .moveTo(100, 150)
//         .lineTo(100, 250)
//         .lineTo(200, 250)
//         .fill("#FF3300");
//
//     doc.circle(280, 200, 50)
//         .fill("#6600FF");
//
// // an SVG path
//     doc.scale(0.6)
//         .translate(470, 130)
//         .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
//         .fill('red', 'even-odd')
//         .restore();
//
//     doc.text('Task ID   Task    Type    Value   Calculated Value    Additional  Captured Picture    QC', 50, x)
//
//
// // and some justified text wrapped into columns
//     req.body.forEach(function (value,index) {
//         x += 50;
//         doc.text(value.Tid+"\t"+value.Task+"\t"+value.Type+"\t"+value.value+"\t"+value.values+"\t"+
//             value.Additional+"\t"+value.ISummary, 50, x);
//
//         // doc.text('And here is some wrapped text...', 100, 300)
//         //     .font('Times-Roman', 13)
//         //     .moveDown()
//         //     .text(value, {
//         //         width: 412,
//         //         align: 'justify',
//         //         indent: 30,
//         //         columns: 1,
//         //         height: 300,
//         //         ellipsis: true
//         //     });
//
//     });
//
// // end and display the document in the iframe to the right
//     doc.end();
//     stream.on('finish', function() {
//         //iframe.src = stream.toBlobURL('application/pdf');
//         res.end();
//     });

    require("jsreport").render({
        template: {
            content: "/reportGeneration",
            recipe: "html",
            engine: 'jsrender',
        },
        data: { reportData: req.body,
            loadReport : true}
    }).then(function(out) {
        //pipes plain text with Hello world from jsreport
        out.stream.pipe(res);

    },function (err) {
        console.log("Error"+err);
    });

};