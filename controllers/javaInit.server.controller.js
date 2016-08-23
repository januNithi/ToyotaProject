/**
 * Created by CSS on 23-08-2016.
 */
var fs = require("fs");
var java = require("java");
var baseDir = "./javaLib";
var dependencies = fs.readdirSync(baseDir);

dependencies.forEach(function(dependency){
    java.classpath.push(baseDir + "/" + dependency);
})

java.classpath.push("./classes");
java.classpath.push("./classes/Main.java");

exports.getJavaInstance = function() {
    console.log(java);
    return java;
}