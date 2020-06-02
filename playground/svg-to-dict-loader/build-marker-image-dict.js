const fs = require('fs');
const path = require('path');
const xml = require('xml-js');

var data = {};

var srcDir = path.join(__dirname, 'public/img/markers');
for(var file of fs.readdirSync(srcDir))
{
    var filePath = path.join(srcDir, file);
    var contents = fs.readFileSync(filePath);

    var svgObj = xml.xml2js(contents, { compact: true });

    delete svgObj._declaration;
    delete svgObj._comment;
    delete svgObj._doctype;

    svgObj.svg._attributes.width = "16";
    svgObj.svg._attributes.height = "16";

    var svgXml = xml.js2xml(svgObj, { compact: true }); 
    
    var name = path.parse(file).name;
    data[name] = svgXml;
}

var outputPath = path.join(__dirname, 'src/boot/marker-icon-data.js');
var outoutContent = 
    '/**** GENERATED USING:       ***/\n' +
    '/**** npm run build-svg-dict ***/\n' +
    'export const SVG_DATA = ' +
    JSON.stringify(data, null, 4);

fs.writeFileSync(outputPath, outoutContent);
