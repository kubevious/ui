/*************************/
/*************************/
/*** DN SHORTCUT BEGIN ***/

const DnShortcutItemTemplate = 
Handlebars.compile(`
<div class="dn-shortcut" dn="{{dn}}" {{#if handler}}onclick="{{handler}}(event)"{{/if}}>
<img class="dn-logo" src="{{logo}}" />
<span class="dn-title">{{{title}}}</span>
</div>
`);

function generateDnShortcutHtml(dn, params)
{
    params = params || {};
    var dnParts = parseDn(dn);
    var lastPart = _.last(dnParts);

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
        title: generateDnPathHtml(dnParts),
        logo: getNodeLogoUrl(lastPart.kind),
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

function generateDnPathHtml(dnParts)
{
    var html = '<span class="dn-path">'
    var parts = [];
    if (dnParts.length > 0) {
        if (dnParts[0].kind == 'root') {
            dnParts = dnParts.splice(1);
        }
    }
    for (var dnPart of dnParts)
    {
        var kind = KIND_TO_USER_MAPPING[dnPart.kind];
        if (!kind) {
            kind = _.upperFirst(dnPart.kind);
        }
        var partHtml = 
            '<span class="kind">' + kind + '</span>' +
            '<span> </span>' + 
            '<span class="name">' + dnPart.name + '</span>';
        parts.push(partHtml);
    }
    html += parts.join(' <span class="separator">&gt;</span> ');
    html += '</span>'
    return html;
}
/***   DN PATH END   ***/
