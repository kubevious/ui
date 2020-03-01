const diagramScope = {
    client: null,
    view: null
};

class DiagramClient
{
	constructor()
	{
        this._timeMachineDate = null;
        this.setTimeMachineDate(null)
    }

    setTimeMachineDate(date)
	{
		if (date) {
			Logger.info("[DiagramClient::setTimeMachineDate] %s", date.toISOString());
		} else {
			Logger.info("[DiagramClient::setTimeMachineDate] none");
        }
        
        this._timeMachineDate = date;
        
        if (!this._timeMachineDate) 
        {
            fetchDiagram((sourceData) => {
                this._acceptSourceData(sourceData);
            });
        }
        else
        {
            fetchHistorySnapshot(this._timeMachineDate, (sourceData) => {
                this._acceptSourceData(sourceData);
            });

            // this._acceptSourceData({
            //     rn: "root",
            //     kind: "root"
            // });
        }
	}
    

    _acceptSourceData(sourceData)
    {
        this.massageSourceData(sourceData);
        this._sourceData = sourceData;

        this._renderData();
    }

    _renderData()
    {
        if (!diagramScope.view) {
            return;
        }

        if (this._sourceData) {
            diagramScope.view.acceptSourceData(this._sourceData);
        }
        diagramScope.view.updateAll(true);
    }

    massageSourceData(data)
    {
        this.massageSourceDataNode(data, null);
    }

    massageSourceDataNode(node, parent)
    {
        var dn;
        if (parent) {
            dn = parent.dn + '/' + node.rn;
        } else {
            dn = node.rn;
        }
        node.dn = dn;
        node.allErrorCount = node.errorCount;
        if (node.children)
        {
            for(var child of node.children)
            {
                this.massageSourceDataNode(child, node);
                node.allErrorCount += child.allErrorCount;
            }
        }
    }

    selectDiagramItem(dn)
    {
        diagramScope.view.selectNodeByDn(dn);
    }

    setupView()
    {
        diagramScope.view = new VisualView(d3.select("#diagram"));

        diagramScope.view.onNodeSelect((node, data) => {
            if (data) {
                Logger.info("[NodeSelected] ", data.dn);
    
                fetchProperties(data.dn, (config) => {
                    Logger.debug("[GotProperties] ", config);
                    showObjectProperties(node, config)
                });
    
                fetchAlerts(data.dn, (config) => {
                    Logger.debug("[GotAlerts] ", config);
                    showObjectAlerts(node, config)
                });
                
            } else {
                Logger.info("[NodeSelected] None");
                clearObjectProperties()
            }
        });

        diagramScope.view.skipShowRoot();
        diagramScope.view.setup(); 
        this._renderData();
    }
}

diagramScope.client = new DiagramClient();

$(document).on("layout-ready", function(e){
    diagramScope.client.setupView();
});

