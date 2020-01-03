var view = new VisualView(d3.select("#diagram"));

view.onNodeSelect((node, data) => {
    if (data) {
        Logger.info("[NodeSelected] ", data.id);

        fetchProperties(data, (config) => {
            Logger.debug("[GotProperties] ", config);
            showObjectProperties(node, config)
        });

        fetchAlerts(data, (config) => {
            Logger.debug("[GotAlerts] ", config);
            showObjectAlerts(node, config)
        });
        
    } else {
        Logger.info("[NodeSelected] None");
        clearObjectProperties()
    }
});

fetchDiagram((sourceData) => {

    massageSourceData(sourceData);

    view.skipShowRoot();
    view.setup(); 
    view.acceptSourceData(sourceData);
    view.render();

});

function massageSourceData(data)
{
    massageSourceDataNode(data, null);
}

function massageSourceDataNode(node, parent)
{
    var dn;
    if (parent) {
        dn = parent.dn + '/' + node.rn;
    } else {
        dn = node.rn;
    }
    node.dn = dn;
    node.allErrorCount = node.errorCount;
    for(var child of node.children)
    {
        massageSourceDataNode(child, node);
        node.allErrorCount += child.allErrorCount;
    }
}

function selectDiagramItem(dn)
{
    view.selectNodeByDn(dn);
}