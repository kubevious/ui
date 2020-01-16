function splitDn(dn)
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

function parseRn(rn)
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

function parseDn(dn)
{
    var parts = splitDn(dn);
    return parts.map(x => parseRn(x));
}

function makeDn(parentDn, childRn)
{
    if (!parentDn) {
        return childRn;
    }
    return parentDn + "/" + childRn;
}
