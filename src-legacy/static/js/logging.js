var LoggerOptions = {
    // defaultLevel: Logger.TRACE,
    defaultLevel: Logger.INFO,
    // formatter: function (messages, context) {
    //     messages.unshift(new Date().toISOString())
    // }
}
Logger.useDefaults(LoggerOptions);


var DefaultLoggerHandler = Logger.createDefaultHandler(LoggerOptions);


function isObject(n) {
    return Object.prototype.toString.call(n) === '[object Object]';
}

$(function() {

    Logger.setHandler(function (msgArgs, context) {
        var msgArgsStr = "";
        for(var i = 1; i < msgArgs.length; i++) {
            var val = msgArgs[i];
            if (isObject(val) || Array.isArray(val)) {
                val = "<pre>" + JSON.stringify(val, null, 4) + "</pre>";
            }
            if (msgArgsStr.length > 0) {
                msgArgsStr += "<br />";
            }
            msgArgsStr += val;
        }

        var row = "<tr>";
        row += "<td>" + new Date().toISOString() + "</td>";
        row += "<td>" + context.level.name + "</td>";
        row += "<td>" + msgArgs[0] + "</td>";
        row += "<td>" + msgArgsStr + "</td>";
        row += "</tr>";
        $( "#logTableBody" ).append( row );

        DefaultLoggerHandler(msgArgs, context);
    });

    Logger.info("Logger init");
});
