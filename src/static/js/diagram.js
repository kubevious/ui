var view = new VisualView(d3.select("#diagram"));

view.onNodeSelect((node, data) => {
    if (data) {
        Logger.info("[NodeSelected] ", data.id);
        fetchProperties(data, (config) => {
            Logger.debug("[GotProperties] ", config);
            showObjectProperties(node, config)
        });
    } else {
        Logger.info("[NodeSelected] None");
        clearObjectProperties()
    }
});

fetchDiagram((sourceData) => {

    view.skipShowRoot();
    view.setup(); 
    view.acceptSourceData(sourceData);
    view.render();

});