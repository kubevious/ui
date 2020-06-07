const diagramScope = {
    client: null,
    view: null
};

class DiagramClient
{
	constructor()
	{
        this._selectedDn = null;
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
        }

        this._loadSelection();
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

        node.alerts = {};
        const ALERT_SEVERITIES = ['error', 'warn'];
        for(var severity of ALERT_SEVERITIES)
        {
            node.alerts[severity] = this._getNodeErrorCount(node, severity);
        }

        if (node.children)
        {
            for(var child of node.children)
            {
                this.massageSourceDataNode(child, node);
                for(var severity of ALERT_SEVERITIES)
                {
                    node.alerts[severity] += child.alerts[severity];
                }
            }
        }
    }

    _getNodeErrorCount(node, kind)
    {
        if (node.alertCount) {
            if (node.alertCount[kind]) {
                return node.alertCount[kind];
            }
        }
        else 
        {
            var propName = kind + "Count";
            if (node[propName]) {
                return node[propName];
            }
        }
        return 0;
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
                this._selectDn(data.dn);
            } else {
                Logger.info("[NodeSelected] None");
                this._selectDn(null);
            }
        });

        diagramScope.view.skipShowRoot();
        diagramScope.view.setup(); 
        this._renderData();
    }

    _selectDn(dn)
    {
        this._selectedDn = dn;
        this._loadSelection();
    }

    _loadSelection()
    {
        if (this._selectedDn)
        {
            if (this._timeMachineDate)
            {
                fetchHistoryProperties(this._selectedDn, this._timeMachineDate, (config) => {
                    Logger.debug("[GotHistoryProperties] ", config);
                    showObjectProperties(this._selectedDn, config.props);
                    showObjectAlerts(this._selectedDn, config.alerts);
                })
            }
            else
            {
                fetchAssets(this._selectedDn, (config) => {
                    Logger.debug("[GotAssets] ", config);
                    showObjectProperties(this._selectedDn, config.props)
                    showObjectAlerts(this._selectedDn, config.alerts)
                });
            }
        }
        else
        {
            clearObjectProperties();
            clearObjectAlerts();
        }
    }
}

diagramScope.client = new DiagramClient();

$(document).on("layout-ready", function(e){
    diagramScope.client.setupView();
});

