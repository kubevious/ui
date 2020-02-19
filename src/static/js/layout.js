class KubeviousLayout
{
    constructor()
    {
        this._components = [];

        this._register({
            name: 'Universe',
            location: 'main',
            html: '<div id="diagram" class="diagram size-to-parent"></div>',
            skipClose: true
        });

        this._register({
            name: 'Properties',
            location: 'right',
            html: '<div id="properties" class="properties"></div>',
            width: 21,
            allowVerticalScroll: true
        });

        this._register({
            name: 'Alerts',
            location: 'bottom',
            html: '<div id="alerts"></div>',
            allowVerticalScroll: true
        });

        this._register({
            name: 'Events',
            location: 'bottom',
            html: '<div id="events"></div>',
            allowVerticalScroll: true
        });

        this._register({
            name: 'Logs',
            location: 'bottom',
            html: '<div id="logs"></div>',
            allowVerticalScroll: true
        });

        this._register({
            name: 'UI Logs',
            location: 'bottom',
            html: '<div id="ui-logs"><table class="table table-striped table-dark"><thead><tr><th scope="col">Date</th><th>Level</th><th>Message</th><th>Args</th></tr></thead><tbody id="logTableBody"></tbody></table></div>',
            allowVerticalScroll: true
        });

        this._register({
            name: 'Timeline',
            location: 'bottom',
            html: '<div id="timeline" class="timeline size-to-parent"></div>',
            allowVerticalScroll: true
        });

        this._activateLayout();
    }

    _activateLayout()
    {
        /**************************/

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
                                    this._getLocationLayout('main'),
                                    this._getLocationLayout('bottom'),
                                ]
                            },
                            this._getLocationLayout('right')
                        ]
                    }
                ]
            }]
        };

        this._layout = new GoldenLayout( this._layoutConfig, '#layout-content' );

        this._layout.on('initialised', () => {
            this._triggerEvent("layout-ready");

            new ResizeSensor($('#layout-content'), () => { 
                this._layout.updateSize();
            });
        });

        for(var component of this._components)
        {
            this._setupContent(component.id, component.html);
        }

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

    _register(info)
    {
        var id = info.name;
        id = _.camelCase(id);
        id = id + 'Component';
        info.id = id;
        this._components.push(info);

        menuScope.menuController.registerWindow(id, info.name);
    }

    _getLocationComponents(location)
    {
        return _.filter(this._components, x => x.location == location);
    }

    _getLocationLayout(location)
    {
        var components = this._getLocationComponents(location);
        if (components.length == 0) {
            return null;
        }
        if (components.length == 1) {
            return this._getComponentLayout(components[0]);
        }

        var layout = {
            type: 'stack',
            height: 20
        }
        layout.content = _.map(components, x => this._getComponentLayout(x));
        return layout;
    }

    _getComponentLayout(component)
    {
        var layout = {};

        layout.type = 'component';
        layout.componentName = component.id;
        layout.title = component.name;
        layout.componentState = {};
        if (component.skipClose) {
            layout.isClosable = false;
        }
        if (component.width) {
            layout.width = component.width;
        }
        if (component.height) {
            layout.height = component.height;
        }
        if (component.allowVerticalScroll) {
            layout.componentState.allowVerticalScroll = component.allowVerticalScroll;
        }
        return layout;
    }

    _setupContent(name, html)
    {
        var self = this;
        this._layout.registerComponent( name, function ( container, componentState ) {
            container.getElement().html( html );

            var layoutSettings = container.layoutManager.config.settings;
            layoutSettings.showPopoutIcon = false;	
            layoutSettings.showCloseIcon = false;	
            
            container.on('resize', () => {
                self._triggerEvent('layout-resize-' + name);
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

    _triggerEvent(id)
    {
        Logger.info("[Layout::_triggerEvent] %s", id);
        $(document).trigger(id);
    }
}





new KubeviousLayout();