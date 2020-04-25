var policyEditor = {
    client: null
}

class PolicyEditor {

    constructor()
	{
        this._policyList = [];
        this._selectedPolicy = null;

        $(document).on("layout-open-policyEditorComponent", () => {
            this._render();
		});
        
		this.refresh();
    }

    refresh()
    {
        fetchPolicyList(data => {
            this._policyList = data;
            this._renderPolicies()
        })
    }

    _render()
    {
        this._renderPolicies();   
    }

    _renderPolicies()
    {
        var html = "";

        for(var x of this._policyList)
        {
            html += this._renderPolicy(x)
        }

        $('#policy-list').html(html);
    }

    _renderPolicy(x)
    {
        var html = '<button class="policy-item-button" tag="' + x.id + '" onclick="policyEditor.client.selectPolicy(' + x.id + ')">' + x.name + "</button>";
        return html;
    }

    selectPolicy(id)
    {

    }
    
};

policyEditor.client = new PolicyEditor();

