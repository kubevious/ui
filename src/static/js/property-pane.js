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

<div class="scrollbar" id="style-3">
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
<div class="environment-variables">
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
    var contentHtml = "";

    if (group.kind == "key-value")
    {
        var propertyList = [];
        for(var key of _.keys(group.config)) {
            propertyList.push({
                key: key,
                value: group.config[key]
            })
        }
        if (useLargeFormat) {
            contentHtml = generateTableHtml(propertyList,
                [{
                    name: 'Variable',
                    value: x => x.key
                }, {
                    name: 'Value',
                    value: x => x.value
                }]);
        } else {
            contentHtml = KeyValuePairTemplate({ 
                properties: propertyList
            });
        }
    } else if (group.kind == "yaml") {
        var code = jsyaml.safeDump(group.config);
        contentHtml = renderCode(group.kind, code);
    }

    return contentHtml;
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

function _renderNodeId(node)
{
    var html = '<div class="target">'

    var parts = [];
    var currNode = node;
    while (currNode) {
        if (currNode.data.kind == "root") {
            break;
        }
        var partHtml = 
            '<span class="kind">' + currNode.data.kind + '</span>' +
            '<span> </span>' + 
            '<span class="name">' + currNode.data.name + '</span>';
        parts.push(partHtml);
        currNode = currNode.parent;
    }
    parts.reverse();
    html += parts.join(' <span class="separator">&gt;</span> ');

    html += '</div>'
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