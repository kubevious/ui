const _ = require('the-lodash');

module.exports.splitDn = function(dn)
{
    var parts = [];

    var ch = null;
    var token = "";
    var parsingKind = true;
    var parsingNaming = true;
    for (var i = 0; i < dn.length; i++) {
        var skipAdd = false;
        ch = dn.charAt(i);
        if (parsingKind) {
            if (ch == '-') {
                parsingKind = false;
            } else if (ch == '/') {
                skipAdd = true;
                parts.push(token);
                token = "";
            }
        } else {
            if (parsingNaming) {
                if (ch == ']') {
                    parsingNaming = false;
                }
            } else {
                if (ch == '[') {
                    parsingNaming = true;
                } else if (ch == '/') {
                    skipAdd = true;
                    parts.push(token);
                    token = "";
                }
            }
        }

        if (!skipAdd) {
            token += ch;
        }
    }

    if (token.length > 0) {
        parts.push(token);
    }

    return parts;
}

module.exports.parseRn = function(rn)
{
    var index = rn.indexOf('-');
    if (index == -1) {
        return {
            rn: rn,
            kind: rn,
            name: null
        };
    }
    return {
        rn: rn,
        kind: rn.substr(0, index),
        name: rn.substr(index + 2, rn.length - (index + 3))
    };
}

module.exports.parseDn = function(dn)
{
    var parts = module.exports.splitDn(dn);
    return parts.map(x => module.exports.parseRn(x));
}

module.exports.parentDn = function(dn)
{
    var parts = module.exports.splitDn(dn);
    return module.exports.makeDn(_.dropRight(parts));
}

module.exports.makeDn = function(parentDn, childRn)
{
    if (_.isArray(parentDn)) {
        return parentDn.join('/');
    }

    if (!parentDn) {
        return childRn;
    }
    return parentDn + "/" + childRn;
}
