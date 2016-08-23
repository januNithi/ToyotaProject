/**
 * Created by CSS on 22-08-2016.
 */

var javaInit = require("javaInit.server.controller.js");
var java = javaInit.getJavaInstance();

exports.getImages = function (req,res) {

    var Main = java.Main();
    console.log(Main);
};