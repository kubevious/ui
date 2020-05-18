var propertiesScope = {
    dn: null,
    expandedMap: {}
};

function showObjectProperties(dn, propertyGroups)
{
    Logger.info("[showObjectProperties] %s", dn, propertyGroups);
    var tryRecoverExpansion = false;
    if (propertiesScope.dn == dn) {
        tryRecoverExpansion = true;
    } else {
        propertiesScope.dn = dn;
    }
    _clearProperties();
    _renderPropertiesNodeDn(dn);
    propertyGroups = _.orderBy(propertyGroups, x => {
        if (x.order) {
            return x.order;
        }
        return 100;
    })
    var isFirst = true;
    propertiesScope.propertyGroups = {}; 
    for(var group of propertyGroups) {
        var isExpanded = false;
        if (tryRecoverExpansion)
        {
            if (propertiesScope.expandedMap[group.id]) {
                isExpanded = true;
            }
        }
        else
        {
            isExpanded = isFirst;
        }
        propertiesScope.propertyGroups[group.id] = group;
        group.dn = dn;
        _renderPropertyGroup(group, isExpanded);
        propertiesScope.expandedMap[group.id] = isExpanded;
        isFirst = false;
    }
}

function clearObjectProperties()
{
    Logger.info("[clearObjectProperties] ");
    propertiesScope.dn = null;
    propertiesScope.expandedMap = {};

    _clearProperties();
}


function _clearProperties()
{
    $('#properties').empty();
}

const PropertyGroupTemplate = 
    Handlebars.compile(`
<div class="property-group">
<button class="expander {{extraClassTitle}}" onclick="propertyExpanderHandleClick(event)" tag="{{groupName}}">
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
        var column = {};
        if (_.isObject(x))
        {
            column.name = x.id
            if (x.label) {
                column.label = x.label;
            }

            if (x.kind) {
                column.formatter = _determineColumnFormatter(group, x.kind);
            }
        }
        else
        {
            column.name = x;
        }
        if (!column.label) {
            column.label = column.name;
        }
        return column;
    });

    return generateTableHtml(
        data,
        columnsInfo);
}

function _determineColumnFormatter(group, kind)
{
    if (kind == 'shortcut') {
        return ((dn) => {
            return generateDnShortcutHtml(dn, {
                handler: "onPropertyPanelDnClick",
                relativeTo: group.dn
            });
        });
    }

    if (kind == 'check') {
        return ((value) => {
            return generateCheckHtml(value);
        });
    }
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
            relativeTo: group.dn
        });
    });
}

function onPropertyPanelDnClick(event)
{
    kubeviousLayout.activateComponent('universeComponent');
    var dn = $(event.currentTarget).attr("dn");
    diagramScope.client.selectDiagramItem(dn);
}

function renderCode(language, code)
{
    var result = hljs.highlight(language, code);
    return '<pre><code>'
        + result.value
        + "</code></pre>";
}

function _renderPropertyGroup(group, isExpanded)
{
    var contentHtml = _renderPropertyGroupContents(group);

    var groupHtml = PropertyGroupTemplate({ 
        title: group.title,
        contentHtml: contentHtml,
        extraClassTitle: (isExpanded ? 'active' : ''),
        extraClassContents: (isExpanded ? 'expander-open' : ''),
        tooltip: group.tooltip,
        dn: group.dn,
        groupName: group.id
    });

    $('#properties').append(groupHtml);  

    activateTooltips();
}

function _renderPropertiesNodeDn(dn)
{
    var dnParts = parseDn(dn);
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

    var groupId = target.getAttribute('tag');
    propertiesScope.expandedMap[groupId] = 
        target.classList.contains('active');
}

function onPropertyGroupPopup(event) {
    var groupName = event.target.getAttribute("tag");
    var group = propertiesScope.propertyGroups[groupName];
    var contentHtml = _renderPropertyGroupContents(group, { useLargeFormat: true });

    var dnParts = parseDn(propertiesScope.dn);
    var headerHtml = 
        generateDnPathHtml(dnParts, true) +
        '<h3>' + group.title + '</h3>';

    popupOpen(contentHtml, {
        focus: "#searchInput",
        header: headerHtml
    });
}