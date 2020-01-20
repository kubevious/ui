/*************************/
/*************************/
/*** DN SHORTCUT BEGIN ***/

const DnShortcutItemTemplate = 
Handlebars.compile(`
<div class="dn-shortcut" dn="{{dn}}" {{#if handler}}onclick="{{handler}}(event)"{{/if}}>
{{{title}}}
</div>
`);

function generateDnShortcutHtml(dn, params)
{
    params = params || {};
    var dnParts = parseDn(dn);

    if (params.relativeTo)
    {
        var parentDnParts = parseDn(params.relativeTo);
        while((dnParts.length > 0) && 
              (parentDnParts.length > 0) && 
              (dnParts[0].rn == parentDnParts[0].rn))
        {
            dnParts.shift();
            parentDnParts.shift();
        }
    }


    var html = DnShortcutItemTemplate({ 
        dn: dn,
        title: generateDnPathHtml(dnParts, true),
        handler: params.handler
    });
    return html;
}

/*** DN SHORTCUT END ***/


/*************************/
/*************************/
/***   DN PATH BEGIN   ***/

const KIND_TO_USER_MAPPING = {
    'ns': 'Namespace',
    'app': 'Application',
    'cont': 'Container',
    'vol': 'Volume',
    'configMap': 'ConfigMap',
    'replicaSet': 'ReplicaSet',
}

function prettyKind(kind)
{
    var prettyKind = KIND_TO_USER_MAPPING[kind];
    if (!prettyKind) {
        prettyKind = _.upperFirst(kind);
    }
    return prettyKind;
}

function generateDnPathHtml(dnParts, includeLogo)
{
    var html = '<div class="dn-path">'
    var parts = [];
    if (dnParts.length > 0) {
        if (dnParts[0].kind == 'root') {
            dnParts = dnParts.splice(1);
        }
    }
    var lastPart = _.last(dnParts);
    if (includeLogo && lastPart) {
        html += '<img class="dn-logo" src="';
        html += getNodeLogoUrl(lastPart.kind);
        html += '" />';
    }
    for (var dnPart of dnParts)
    {
        var kind = prettyKind(dnPart.kind);
        var partHtml = 
            '<span class="kind">' + kind + '</span>' +
            '<span> </span>' + 
            '<span class="name">' + dnPart.name + '</span>';
        parts.push(partHtml);
    }
    html += parts.join(' <span class="separator">&gt;</span> ');
    html += '<div class="clearfix"></div>'
    html += '</div>'
    return html;
}
/***   DN PATH END   ***/
