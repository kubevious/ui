var myPropertyGroups = {};

function showObjectProperties(node, propertyGroups)
{
    Logger.info("[showObjectProperties] ", node.data.id, propertyGroups);
    _clearProperties();
    _renderNodeId(node);
    propertyGroups = _.orderBy(propertyGroups, x => {
        if (x.order) {
            return x.order;
        }
        return 100;
    })
    var isExpanded = true;
    myPropertyGroups = {}; 
    for(var group of propertyGroups) {
        myPropertyGroups[group.id] = group;
        _renderPropertyGroup(node, group, isExpanded);
        isExpanded = false;
    }
}

function clearObjectProperties()
{
    Logger.info("[clearObjectProperties] ");
    _clearProperties();
}


function _clearProperties()
{
    $('#properties').empty();
}

const PropertyGroupTemplate = 
    Handlebars.compile(`
<div class="property-group">
<button class="expander {{extraClassTitle}}" onclick="propertyExpanderHandleClick(event)">
    <span class="openclose"></span>{{title}}
    <span class="popup-expander" onclick="onPropertyGroupPopup(event)" tag="{{groupName}}"></span>
</button>
<div class="scrollbar dark">
    <div class="force-overflow">
        <div class="expander-contents {{extraClassContents}}">
            {{{contentHtml}}}
        </div>
    </div>
</div>
</div>
`);

const KeyValuePairTemplate = 
    Handlebars.compile(`
<div>
    {{#each properties}}
    <div class="environment-variable">
        <div class="name">{{key}}</div>
        <div class="value">{{{value}}}</div>
    </div>
    {{/each}}
</div>
`);

function _renderPropertyGroupContents(group, useLargeFormat)
{
    if (group.kind == "key-value")
    {
        return _renderKeyValueContents(group, useLargeFormat);
    } 
    else if (group.kind == "dn-list") 
    {
        return _renderDnListContents(group, useLargeFormat);
    }
    else if (group.kind == "yaml")
    {
        var code = jsyaml.safeDump(group.config);
        return renderCode(group.kind, code);
    }

    return "";
}

function _renderKeyValueContents(group, useLargeFormat)
{
    var propertyList = [];
    for(var key of _.keys(group.config)) {
        propertyList.push({
            key: key,
            value: group.config[key]
        })
    }
    if (useLargeFormat) {
        return generateTableHtml(propertyList,
            [{
                name: 'Variable',
                value: x => x.key
            }, {
                name: 'Value',
                value: x => x.value
            }]);
    } else {
        return KeyValuePairTemplate({ 
            properties: propertyList
        });
    }
}

function _renderDnListContents(group, useLargeFormat)
{
    var dns = group.config;
    return generateList(dns, dn => {

        // TODO: Make generic with Search Library
        var dnParts = parseDn(dn);
        var lastPart = _.last(dnParts);
    
        var html = SearchResultItemTemplate({ 
            dn: dn,
            title: generateDnPathHtml(dnParts),
            logo: getNodeLogoUrl(lastPart.kind)
        });
        return html;

        // var dnParts = parseDn(dn);
        // var html = generateDnPathHtml(dnParts);
        // return html;
    });
}

function renderCode(language, code)
{
    var result = hljs.highlight(language, code);
    return '<pre><code>'
        + result.value
        + "</code></pre>";
}

function _renderPropertyGroup(node, group, isExpanded)
{
    var contentHtml = _renderPropertyGroupContents(group, false);

    var groupHtml = PropertyGroupTemplate({ 
        title: group.title,
        contentHtml: contentHtml,
        extraClassTitle: (isExpanded ? 'active' : ''),
        extraClassContents: (isExpanded ? 'expander-open' : ''),
        dn: node.data.id,
        groupName: group.id
    });

    $('#properties').append(groupHtml);  
}

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
    for (var dnPart of dnParts.splice(1))
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

function _renderNodeId(node)
{
    var dnParts = parseDn(node.data.dn);
    var html = generateDnPathHtml(dnParts);
    $('#properties').append(html);  
}

function propertyExpanderHandleClick(event) {
    var target = event.currentTarget;
    target.classList.toggle("active");
    var contentsElem = target.parentElement.getElementsByClassName("expander-contents")[0];
    contentsElem.classList.toggle("expander-open");
}

function onPropertyGroupPopup(event) {
    var groupName = event.target.getAttribute("tag");
    var group = myPropertyGroups[groupName];
    var contentHtml = _renderPropertyGroupContents(group, true);
    popupOpen(contentHtml);
}