class KubeviousLayout
{
    constructor()
    {
        this._layoutConfig = {
            content: [{
                type: 'column',
                content:[
                    {
                        type: 'row',
                        content:[
                            {
                                type: 'column',
                                content: [
                                    {
                                        type: 'component',
                                        title: 'Universe',
                                        isClosable: false,
                                        componentName: 'diagramComponent'
                                    },
                                    {
                                        type: 'stack',
                                        height: 20,
                                        content: [
                                            {
                                                type: 'component',
                                                title: 'Timeline',
                                                componentName: 'timelineComponent'
                                            },
                                            {
                                                type: 'component',
                                                title: 'Alerts',
                                                componentName: 'alertsComponent',
                                                componentState: {
                                                    allowVerticalScroll: true
                                                }
                                            },
                                            {
                                                type: 'component',
                                                title: 'Events',
                                                componentName: 'eventsComponent',
                                                componentState: {
                                                    allowVerticalScroll: true
                                                }
                                            },
                                            {
                                                type: 'component',
                                                title: 'Logs',
                                                componentName: 'logsComponent',
                                                componentState: {
                                                    allowVerticalScroll: true
                                                }
                                            },
                                            {
                                                type: 'component',
                                                title: 'UI Logs',
                                                componentName: 'uiLogsComponent',
                                                componentState: {
                                                    allowVerticalScroll: true
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'component',
                                title: 'Properties',
                                componentName: 'propertiesComponent',
                                width: 21,
                                componentState: {
                                    allowVerticalScroll: true
                                }
                            }
                        ]
                    }
                ]
            }]
        };

        this._layout = new GoldenLayout( this._layoutConfig, '#layout-content' );

        this._layout.on('initialised', () => {
            $(document).trigger("layout-ready");

            new ResizeSensor($('#layout-content'), () => { 
                this._layout.updateSize();
            });
        });

        this._layout.registerComponent( 'testComponent', function( container, componentState ){
            container.getElement().html( '<h2>' + '</h2>' );
        });

        this._setupContent('diagramComponent', '<div id="diagram" class="diagram size-to-parent"></div>');

        this._setupContent('propertiesComponent', '<div id="properties" class="properties"></div>');

        this._setupContent('alertsComponent', '<div id="alerts"></div>');
        this._setupContent('eventsComponent', '<div id="events"></div>');
        this._setupContent('logsComponent', '<div id="logs"></div>');
        this._setupContent('uiLogsComponent', '<div id="ui-logs"><table class="table table-striped table-dark"><thead><tr><th scope="col">Date</th><th>Level</th><th>Message</th><th>Args</th></tr></thead><tbody id="logTableBody"></tbody></table></div>');
        this._setupContent('timelineComponent', '<div id="timeline" class="timeline size-to-parent"></div>');

        this._layout.on('itemCreated', function(item) {
        });

        this._layout.on('componentCreated', function(component) {
        });

        this._layout.on('stackCreated', function(stack) {
        });

        this._layout.on('tabCreated', function(tab) {
        });

        this._layout.init();
    }

    _setupContent(name, html)
    {
        this._layout.registerComponent( name, function( container, componentState ){
            container.getElement().html( html );

            var layoutSettings = container.layoutManager.config.settings;
            layoutSettings.showPopoutIcon = false;	
            layoutSettings.showCloseIcon = false;	
            
            container.on('resize', () => {
                $(document).trigger('layout-resize-' + name);
            })

            container.on('open', (x) => {
                var element = container.getElement();
                if (componentState.allowVerticalScroll) 
                {
                    element.css("overflow-y", "auto");
                }
            })
        });
    }

}





new KubeviousLayout();