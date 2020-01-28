var mySelectedObj = {};

function showObjectProperties(node, propertyGroups)
{
    Logger.info("[showObjectProperties] ", node.data.dn, propertyGroups);
    mySelectedObj.dn = node.data.dn;
    _clearProperties();
    _renderPropertiesNodeDn(node);
    propertyGroups = _.orderBy(propertyGroups, x => {
        if (x.order) {
            return x.order;
        }
        return 100;
    })
    var isExpanded = true;
    mySelectedObj.propertyGroups = {}; 
    for(var group of propertyGroups) {
        mySelectedObj.propertyGroups[group.id] = group;
        group.node = node;
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
    {{title}}
    <span class="property-group-openclose"></span>
    <span class="property-group-popup" onclick="onPropertyGroupPopup(event)" tag="{{groupName}}"></span>
    {{#if tooltip}}
    <span class="property-group-info" data-toggle="tooltip" data-placement="top" title="{{tooltip}}"></span>
    {{/if}}
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

function _renderPropertyGroupContents(group, options)
{
    options = options || {};
    if (group.kind == "key-value")
    {
        if (group.id == 'env') {
            options.keyLabel = "Variable";
        }
        return _renderKeyValueContents(group.config, options);
    } 
    else if (group.kind == "dn-list") 
    {
        return _renderDnListContents(group, options);
    }
    else if (group.kind == "yaml")
    {
        var code = jsyaml.safeDump(group.config);
        return renderCode(group.kind, code);
    }
    else if (group.kind == "table")
    {
        return _renderTableContents(group, options);
    } 

    return "";
}

function _renderTableContents(group, options)
{
    options = options || {};

    var config = group.config;

    var data = config.rows;
    var columnsInfo = config.headers.map(x => {
        var column = { name: x, label: x };
        if (config.shortcuts) {
            if (config.shortcuts[x]) {
                column.formatter = ((dn) => {
                    return generateDnShortcutHtml(dn, {
                        handler: "onPropertyPanelDnClick",
                        relativeTo: group.node.data.dn
                    });
                });
            }
        }
        return column;
    });

    return generateTableHtml(
        data,
        columnsInfo);
}

function _renderKeyValueContents(config, options)
{
    options = options || {};

    var propertyList = [];
    for(var key of _.keys(config)) {
        propertyList.push({
            key: key,
            value: config[key]
        })
    }
    if (options.useLargeFormat) {
        var keyLabel = options.keyLabel || 'Property';
        var valueLabel = options.valueLabel || 'Value';
        return generateTableHtml(propertyList,
            [{
                label: keyLabel,
                name: 'key'
            }, {
                label: valueLabel,
                name: 'value'
            }]);
    } else {
        return KeyValuePairTemplate({ 
            properties: propertyList
        });
    }
}

function _renderDnListContents(group, options)
{
    options = options || {};

    var dns = group.config;
    return generateList(dns, dn => {
        return generateDnShortcutHtml(dn, {
            handler: "onPropertyPanelDnClick",
            relativeTo: group.node.data.dn
        });
    });
}

function onPropertyPanelDnClick(event)
{
    var dn = $(event.currentTarget).attr("dn");
    selectDiagramItem(dn);
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
    var contentHtml = _renderPropertyGroupContents(group);

    var groupHtml = PropertyGroupTemplate({ 
        title: group.title,
        contentHtml: contentHtml,
        extraClassTitle: (isExpanded ? 'active' : ''),
        extraClassContents: (isExpanded ? 'expander-open' : ''),
        tooltip: group.tooltip,
        dn: node.data.id,
        groupName: group.id
    });

    $('#properties').append(groupHtml);  

    activateTooltips();
}

function _renderPropertiesNodeDn(node)
{
    var dnParts = parseDn(node.data.dn);
    var html = '<div class="properties-owner">';
    html += generateDnPathHtml(dnParts);
    html += '</div>';

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
    var group = mySelectedObj.propertyGroups[groupName];
    var contentHtml = _renderPropertyGroupContents(group, { useLargeFormat: true });

    var dnParts = parseDn(mySelectedObj.dn);
    var headerHtml = 
        generateDnPathHtml(dnParts, true) +
        '<h3>' + group.title + '</h3>';

    popupOpen(contentHtml, {
        focus: "#searchInput",
        header: headerHtml
    });
}