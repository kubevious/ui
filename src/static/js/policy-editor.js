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
                        "<button class='start-new-policy-btn' onclick='policyEditor.client.createNewPolicy()'>New Policy</button> " +
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
                "</div>" +
                "<div class='policies'>"

        for(var x of this._policyList)
        {
            html += this._renderPolicy(x)
        }
        html += "</div>" +
            "<button class='new-policy-btn' onclick='policyEditor.client.createNewPolicy()'>" +
                "<div class='circle-btn'>+</div> New Policy" +
            "</button> " +
            "<div class='list-btn'>" +
                "<label for='upload-policy' class='file-upload'>Import</label>" +
                "<input type='file' id='upload-policy' name='upload-policy' onchange='policyEditor.client.uploadFile()' />" +
                "<button class='menu-btn' onclick='policyEditor.client.export()'>Export</button>" +
                "<a id='exportAnchor' style='display:none' />" +
            "</div>"

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
        const className = 'indicator ' + (x.enabled ? 'enabled' : 'disabled')

        var html = '<button class="policy-item-button" onclick="policyEditor.client.selectPolicy(' + x.id + ', event)">' +
            x.name +
            '<div class="' + className + '" />' +
            '</button>';
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
                    "<label class='checkbox-container'>Enable/Disable" +
                        "<input type='checkbox'  onclick='policyEditor.client.changeEnable()' class='enable-checkbox' />" +
                        "<span class='checkmark'></span>" +
                    "</label> " +
                "<div class='btn-group'>" +
                    this.renderButtons() +
                "</div>" +
            "</div>"

        $('#policy-editor').html(html);

        $('.field-input.name').val(this._selectedPolicy.name)
        $('.field-input.target').val(this._selectedPolicy.target)
        $('.field-input.script').val(this._selectedPolicy.script)
        $('.enable-checkbox').prop('checked', this._selectedPolicy.enabled)

        const codeMirror = CodeMirror.fromTextArea(document.getElementById('script'), {
            mode: 'javascript',
            smartIntend: true,
            theme: 'darcula',
            extraKeys: { 'Ctrl-Space': 'autocomplete' }
        })

        codeMirror.on('change', editor => {
            policyEditor.client.changePolicy(editor.getValue(), 'script', 'script')
        })

        codeMirror.on('keyup', function (cm, event) {
            if (!cm.state.completionActive && event.keyCode > 64 && event.keyCode < 91) {
                CodeMirror.commands.autocomplete(cm, null, { completeSingle: false })
            }
        })

    }

    renderButtons()
    {
        var html = ""

        if (this._selectedPolicy.id) {
            html += "<button class='policy-btn' onclick='policyEditor.client.deletePolicy()'>Delete</button>" +
                "<button class='policy-btn' onclick='policyEditor.client.cancelPolicy()'>Cancel</button>" +
                "<button class='policy-btn save-btn' onclick='policyEditor.client.savePolicy()'>Save</button>"

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

    selectPolicy(id, event)
    {
        backendFetchPolicy(id, data => {
            this._selectedPolicy = { ...data }
            this._renderPolicyEditor()
            this.setInitPolicy()

            $('.policy-item-button').removeClass('selected')
            $(event.target).addClass('selected')
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

    changeEnable()
    {
        this._selectedPolicy.enabled = !this._selectedPolicy.enabled
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

    export()
    {
        backendExportPolicies(response => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response))
            const exportElem = document.getElementById('exportAnchor')
            exportElem.setAttribute('href', dataStr)
            exportElem.setAttribute('download', 'policies.json')
            exportElem.click()
        })
    }

    uploadFile()
    {
        const input = document.getElementById('upload-policy')

        if (input.files.length === 0) {
            console.error('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function fileReadCompleted() {
            backendImportPolicies(JSON.parse(reader.result), () => {})
        };

        reader.readAsText(input.files[0]);
        this.refresh()
    }

    isEmptyFields()
    {
        return Object.values(this._selectedPolicy).some(item => item === '')
    }
};

policyEditor.client = new PolicyEditor();

