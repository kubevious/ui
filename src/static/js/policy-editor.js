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
        backendFetchPolicyList(data => {
            this._policyList = [...data];
            this._render()
        })
    }

    _render()
    {
        if (this._policyList.length === 0) {
            $('#policy-list').css('display', 'none')

            this._renderStartPolicy()
        } else {
            $('#policy-list').css('display', 'initial')

            this._renderPolicies();
            this._renderPolicyMainPage()
        }
    }

    _renderStartPolicy()
    {
        $('#policy-list').css('display', 'none')

        var html = "<div class='start-policy-container'>" +
                "<div class='start-wrapper'>" +
                    "<div class='start-text'>You have no policies defined. Time to create your new policy:</div>" +
                    "<div class='start-btn-wrapper'>" +
                        "<button class='start new-policy-btn' onclick='policyEditor.client.createNewPolicy()'>New Policy</button> " +
                    "</div>" +
                    "<div class='start-text'>Learn more about Kubevious policies here.</div>" +
                "</div>" +
            "</div>"

        $('#policy-editor').html(html)
    }

    _renderPolicies()
    {
        var html = "";

        html += "<div class='policy-header'>" +
                    "<div class='title'>Summary - " + this._policyList.length +"</div>" +
                    "<button class='new-policy-btn' onclick='policyEditor.client.createNewPolicy()'>New Policy</button> " +
                "</div>" +
                "<div class='policies'>"

        for(var x of this._policyList)
        {
            html += this._renderPolicy(x)
        }
        html += "</div>"

        $('#policy-list').html(html);
    }

    _renderPolicyMainPage()
    {
        var html = ""

        html += "<div class='policy-container'>Policies</div>"

        $('#policy-editor').html(html);
    }

    _renderPolicy(x)
    {
        var html = '<button class="policy-item-button" onclick="policyEditor.client.selectPolicy(' + x.id + ')">' + x.name + "</button>";
        return html;
    }

    _renderPolicyEditor()
    {
        var html = ""

        html += "<div class='policy-container'>" +
                    "<div class='field'>" +
                        "<div class='label-wrapper'> " +
                                "<label>Name</label>" +
                        "</div>" +
                        "<input class='field-input name' name='name' oninput='policyEditor.client.changePolicy(event.target.value, event.target.name, event.target)' required />" +
                    "</div>" +

                    "<div class='field'>" +
                        "<div class='label-wrapper'> " +
                            "<label>Target</label>" +
                        "</div>" +
                        "<input class='field-input target' name='target' oninput='policyEditor.client.changePolicy(event.target.value, event.target.name, event.target)' required />" +
                    "</div>" +

                    "<div class='field'>" +
                        "<div class='label-wrapper'> " +
                            "<label>Policy script</label>" +
                        "</div>" +
                        "<textarea id='script' class='field-input script' name='script' required />" +
                    "</div>" +
                "<div class='btn-group'>" +
                    this.renderButtons() +
                "</div>" +
            "</div>"

        $('#policy-editor').html(html);

        $('.field-input.name').val(this._selectedPolicy.name)
        $('.field-input.target').val(this._selectedPolicy.target)
        $('.field-input.script').val(this._selectedPolicy.script)

        CodeMirror.fromTextArea(document.getElementById('script'), {
            mode: "javascript",
            lineNumbers : true,
            smartIntend: true
        }).on('change', editor => {
            policyEditor.client.changePolicy(editor.getValue(), 'script', 'script')
        });

    }

    renderButtons()
    {
        var html = ""

        if (this._selectedPolicy.id) {
            html += "<button class='btn' onclick='policyEditor.client.cancelPolicy()'>Cancel</button>" +
                "<button class='btn save-btn' onclick='policyEditor.client.savePolicy()'>Save</button>" +
                "<button class='btn' onclick='policyEditor.client.deletePolicy()'>Delete</button>"
        } else {
            html += "<button class='btn create-btn' onclick='policyEditor.client.createPolicy()' disabled>Create</button>"
        }

        return html
    }

    setInitPolicy()
    {
        this._initPolicy = { ...this._selectedPolicy }
    }

    setSelectedPolicy()
    {
        this._selectedPolicy = { ...this._initPolicy }
    }

    selectPolicy(id)
    {
        backendFetchPolicy(id, data => {
            this._selectedPolicy = { ...data }
            this._renderPolicyEditor()
            this.setInitPolicy()
        })
    }

    createNewPolicy()
    {
        this._selectedPolicy = { name: '', enabled: true, target: '', script: '' }
        this._renderPolicyEditor()
    }

    changePolicy(value, field, target)
    {
        this._selectedPolicy[field] = value

        if (value === '' && target === 'script') {
            $('.CodeMirror').addClass('required-field')
        } else if (value === '') {
            $(target).addClass('required-field')
        }

        if (value !== '' && target === 'script') {
            $('.CodeMirror').removeClass('required-field')
        } else if (value !== '') {
            $(target).removeClass('required-field')
        }

        $('.create-btn, .save-btn').prop('disabled', this.isEmptyFields())
    }

    cancelPolicy()
    {
        this.setSelectedPolicy()
        this._renderPolicyEditor()
    }

    savePolicy()
    {
        backendUpdatePolicy(this._selectedPolicy.id, this._selectedPolicy, () => {
            this.refresh()
        })
    }

    deletePolicy()
    {
        backendDeletePolicy(this._selectedPolicy.id, () => {
            this._selectedPolicy = null
            this.refresh()
        })
    }

    createPolicy()
    {
        backendCreatePolicy(this._selectedPolicy, () => {
            this.refresh()
        })
    }

    isEmptyFields()
    {
        return Object.values(this._selectedPolicy).some(item => item === '')
    }
};

policyEditor.client = new PolicyEditor();

