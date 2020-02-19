const menuScope = {
	menuController: null,
};


class MenuController
{
	constructor()
	{
        this._windows = {};
        this.setupItems();
    }
    
    registerWindow(id, name)
    {
        Logger.info("[MenuController::registerWindow] %s :: %s", id, name);
        this._windows[id] = {
            id: id,
            labelElementId: 'toolWindowShowHideLabel' + id,
            inputElementId: 'toolWindowShowHideInput' + id,
            name: name,
            isVisible: true
        };
        this.setupItems();
    }

    handleClick(target)
    {
        var windowId = target.getAttribute('tool-window-id');
        Logger.info("[MenuController::handleClick] id: %s, checked: %s", windowId, target.checked);

        var info = this._windows[windowId];
        info.isVisible = target.checked;
        this._refreshItem(info);
    }

    setupItems()
    {
        $(document).ready(() => {
            $('#tool-windows-menu').html('');

            for(var info of _.values(this._windows))
            {
                var html = 
                    '<span class="s-menu-item">' + 
                        '<label id="' + info.labelElementId + '"class="ccheck">' + 
                            this._getLabel(info) + 
                            '<input id="' + info.inputElementId + '" tool-window-id="' + info.id + '" type="checkbox" checked="checked" onclick="menuScope.menuController.handleClick(this)">' +
                            '<span class="checkmark"></span>'; 
                        '</label>';
                    '</span>';
                $('#tool-windows-menu').append(html);
            }
        });
    }

    _refreshItem(info)
    {
        $("#" + info.labelElementId).contents()[0].data = this._getLabel(info);
    }

    _getLabel(info)
    {
        var label = info.name;
        if (info.isVisible) {
            label = 'Hide ' + label;
        } else {
            label = 'Show ' + label;
        }
        return label
    }
}

menuScope.menuController = new MenuController();
