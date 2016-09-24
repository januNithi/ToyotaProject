/**
 * Created by CSS on 21-09-2016.
 */


var json2xls = require('json2xls');

var PDFDocument = require('pdfkit');

var blobStream  = require('blob-stream');

var fs = require('fs');

exports.reportGeneration = function (req,res) {

    var xls = json2xls(req.body);

    fs.writeFileSync('public/uploads/data.xlsx', xls, 'binary');

    res.download(__dirname+"/../public/uploads/data.xlsx",'data.xlsx', function(err,result){
        if (err) {
            // Handle error, but keep in mind the response may be partially-sent
            // so check res.headersSent
        } else {
            res.end();
        }
    });
};

exports.deleteFile = function (req,res) {
    fs.unlink('public/uploads/data.xlsx');
    res.end();
}

exports.pdfGeneration = function (req,res) {

    // create a document and pipe to a blob
    var doc = new PDFDocument();
    var stream = doc.pipe(blobStream());
    doc.pipe(fs.createWriteStream('public/uploads/output.pdf'));

    var x = 50;

// draw some text
    doc.fontSize(12)
        .text('ServiceID : '+req.body.serviceId+'          Model : '+req.body[0].Mid+'              Service Type : '+req.body[0].MType, 50, x);

    x += 50;

// some vector graphics
    doc.save()
        .moveTo(100, 150)
        .lineTo(100, 250)
        .lineTo(200, 250)
        .fill("#FF3300");

    doc.circle(280, 200, 50)
        .fill("#6600FF");

// an SVG path
    doc.scale(0.6)
        .translate(470, 130)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();

    doc.text('Task ID   Task    Type    Value   Calculated Value    Additional  Captured Picture    QC', 50, x)


// and some justified text wrapped into columns
    req.body.forEach(function (value,index) {
        x += 50;
        doc.text(value.Tid+"\t"+value.Task+"\t"+value.Type+"\t"+value.value+"\t"+value.values+"\t"+
            value.Additional+"\t"+value.ISummary, 50, x);

        // doc.text('And here is some wrapped text...', 100, 300)
        //     .font('Times-Roman', 13)
        //     .moveDown()
        //     .text(value, {
        //         width: 412,
        //         align: 'justify',
        //         indent: 30,
        //         columns: 1,
        //         height: 300,
        //         ellipsis: true
        //     });

    });

// end and display the document in the iframe to the right
    doc.end();
    stream.on('finish', function() {
        //iframe.src = stream.toBlobURL('application/pdf');
        res.end();
    });

};