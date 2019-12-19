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
    for(var group of propertyGroups) {
        _renderPropertyGroup(group, isExpanded);
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
<button class="title expander {{extraClassTitle}}" onclick="propertyExpanderHandleClick(event)">{{title}}</button>
<div class="property-group-contents expander-contents {{extraClassContents}}">
{{{contentHtml}}}
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

function _renderPropertyGroup(group, isExpanded)
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
        contentHtml = KeyValuePairTemplate({ 
            properties: propertyList
        });
    } else if (group.kind == "yaml") {
        contentHtml = "<pre>"
            + jsyaml.safeDump(group.config)
            +  "</pre>"
    }

    var groupHtml = PropertyGroupTemplate({ 
        title: group.name,
        contentHtml: contentHtml,
        extraClassTitle: (isExpanded ? 'active' : ''),
        extraClassContents: (isExpanded ? 'expander-open' : '')
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
    event.target.classList.toggle("active");
    event.target.nextElementSibling.classList.toggle("expander-open");
}