/**
 * Created by CSS on 22-08-2016.
 */

var javaInit = require("./javaInit.server.controller.js");
var java = javaInit.getJavaInstance();

exports.getImages = function (req,res) {

    var main = java.newInstanceSync("Main");
    console.log(main);
};