const fs = require('fs');
const path = require('path');
const xml = require('xml-js');

var srcDir = path.join(__dirname, 'public/img/markers');
for(var file of fs.readdirSync(srcDir))
{
    var filePath = path.join(srcDir, file);
    var contents = fs.readFileSync(filePath);
    // console.log(filePath);
    // console.log(contents);
    var svgObj = xml.xml2js(contents, { compact: true });
    console.log(svgObj);
    console.log();

    var svgXml = xml.js2xml(svgObj, { compact: true });  
    console.log(svgXml);
    console.log();
}