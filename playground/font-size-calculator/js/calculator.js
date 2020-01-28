const FONT_FAMILIES = ['Montserrat', 'Roboto'];
const FONT_SIZES = [10, 12, 14];
const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

function makeStyleStr(family, size, weight)
{
    return "font-family: " + family + "; font-size: " + size + "; font-weight: " + weight + ";";
}

function makeStyleID(family, size, weight)
{
    return family + "_" + size + "_" + weight;
}

var START_ASCII_CODE = 32;
var END_ASCII_CODE = 126;

var JOBS = [];

var FONT_DICT = {};

$(document).ready(function() {

    measureContext.lastFontId = null;

    $("#btnCalculate").click(function(){

        for(var family of FONT_FAMILIES)
        {
            for(var fontSize of FONT_SIZES)
            {
                var fontSizeStr = fontSize + "px";
                for(var weight of FONT_WEIGHTS)
                {
                    var fontId = makeStyleID(family, fontSizeStr, weight);
                    var style = makeStyleStr(family, fontSizeStr, weight);
                    // console.log(id);
                    for(var charCode = START_ASCII_CODE; charCode <= END_ASCII_CODE; charCode++)
                    {
                        var char = String.fromCharCode(charCode);
                        if (char == " ") {
                            char = "&nbsp;"
                        }
                        JOBS.push({
                            fontId: fontId,
                            family: family,
                            size: fontSizeStr,
                            weight: weight,
                            style: style,
                            char: char,
                            charCode: charCode
                        });
                    }
                }
            }
        }
        console.log("JOB COUNT: " + JOBS.length);
        // console.log(JOBS);

        runNext();
    }); 
});

var measureContext = {
}

function measureText()
{
    $('#mySpan')
        .attr('style', measureContext.style)
        .html(measureContext.text);

    window.requestAnimationFrame(fetchSize);
}

function fetchSize()
{
    var size = $("#mySpan")[0].getBoundingClientRect()
    if (!measureContext.oldSize) {
        measureContext.oldSize = size;
        measureText();
    } else {
        if (measureContext.oldSize.width != size.width ||
            measureContext.oldSize.height != size.height)
        {
            measureContext.oldSize = size;
            measureText()
        }
        else
        {
            measureContext.oldSize = size;
            finishJob(size);
        }
    }
}

function finishJob(size)
{
    var job = measureContext.job;

    if (measureContext.lastFontId) {
        if (measureContext.lastFontId != job.fontId) {
            outputFontData();
        }
    }
    measureContext.lastFontId = job.fontId;

    var width = round(size.width, 2);
    // FONT_DICT[job.fontId].chars.push(job.char)
    FONT_DICT[job.fontId].widths.push(width);

    // console.log(FONT_DICT);
    runNext();
}

function outputFontData()
{
    if (!measureContext.lastFontId) {
        return;
    }

    var fontData = FONT_DICT[measureContext.lastFontId];

    var varName = _.toUpper(measureContext.lastFontId);
    var code = 'const ' + varName + ' = ' + JSON.stringify(fontData) + ';';
    $('#results').append('<pre><code>' + code + '</code></pre>');
    $('#results').append('<br />');

    measureContext.lastFontId = null;
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function runNext()
{
    console.log(JOBS.length);
    if (JOBS.length == 0)
    {
        outputFontData();

        console.log("********** DONE!!! ******** ");
        console.log(JSON.stringify(FONT_DICT));
        return;
    }
    var job = JOBS[0];
    JOBS.shift();

    if (!FONT_DICT[job.fontId]) {
        FONT_DICT[job.fontId] = {
            // chars: [],
            widths: [],
            startCode: START_ASCII_CODE
        };
    }

    // setTimeout(runNext, 0);

    measureContext.job = job;
    measureContext.oldSize = null;
    measureContext.style = job.style;
    measureContext.text = job.char;
    measureText();
}