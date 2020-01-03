function splitDn(dn)
{
    var parts = dn.split("/");
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
        name: rn.substr(index + 1)
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