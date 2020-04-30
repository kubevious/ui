var ruleEditor = {
    client: null
}

class RuleEditor {

    constructor()
	{
        this._ruleList = [];
        this._selectedRule = null;
        this._deleteExtra = false

        $(document).on("layout-open-ruleEditorComponent", () => {
            this._render();
		});

        $('body').click(function (e) {
            if (!$(e.target).closest('.list-btn').length) {
                $('.import-options').css('display', 'none')
            }
        })
        
		this.refresh();
    }

    refresh()
    {
        backendFetchRuleList(data => {
            this._ruleList = [...data];
            this._render()
        })
    }

    _render()
    {
        if (this._ruleList.length === 0) {
            $('#rule-list').css('display', 'none')

            this._renderStartPage()
        } else {
            $('#rule-list').css('display', 'initial')

            this._renderRules();
            this._renderRuleMainPage()
        }
    }

    _renderStartPage()
    {
        $('#rule-list').css('display', 'none')

        var html = "<div class='start-rule-container'>" +
                "<div class='start-wrapper'>" +
                    "<div class='start-text'>You have no rules defined. Time to create your new rule:</div>" +
                    "<div class='start-btn-wrapper'>" +
                        "<button class='start-new-rule-btn' onclick='ruleEditor.client.createNewRule()'>New Rule</button> " +
                    "</div>" +
                    "<div class='start-text'>Learn more about Kubevious rule here.</div>" +
                "</div>" +
            "</div>"

        $('#rule-editor').html(html)
    }

    _renderRules()
    {
        var html = "";

        html += "<div class='rule-header'>" +
                    "<div class='title' onclick='ruleEditor.client.openSummary()'>Summary</div>" +
                "</div>" +
                "<div class='rules'>"

        for(var x of this._ruleList)
        {
            html += this._renderRule(x)
        }
        html += "</div>" +
            "<button class='new-rule-btn' onclick='ruleEditor.client.createNewRule()'>" +
                "<div class='circle-btn'>+</div> New Rule" +
            "</button> " +
            "<div class='list-btn'>" +
                "<button class='menu-btn' onclick='ruleEditor.client.export()'>Backup</button>" +
                "<a id='exportAnchor' style='display:none' />" +
                this.renderLabel() +
                "<input type='file' id='upload-rule' name='upload-rule' onchange='ruleEditor.client.uploadFile()' />" +
            "</div>"

        $('#rule-list').html(html);
    }

    renderLabel()
    {
        var html = ""

        html += "<label for='upload-rule' class='file-upload'>" +
            "<div class='label-text'>Import</div>" +
            "</label>" +
            "<div class='label-arrow' onclick='ruleEditor.client._renderExportOptions()' />" +
            "<div id='import-container' />"

        return html
    }

    _renderExportOptions()
    {
        var html = ""

        html+= "<div class='import-options'>" +
                    "<div class='option' onclick='ruleEditor.client.setSelectedImport(true)'>" +
                        "<button class='option-btn'>Restore</button>" +
                        "<div class='option-desc'>" +
                            'Import rules from file and delete  any extra rule.' +
                        "</div>" +
                    "</div>" +
                    "<div class='option' onclick='ruleEditor.client.setSelectedImport(false)'>" +
                        "<button class='option-btn'>Import</button>" +
                        "<div class='option-desc'>" +
                            ' Import rules from file and keep existing extra rules.' +
                        "</div>" +
                "</div>" +
            "</div>"

        $('#import-container').html(html);
    }

    _renderRuleMainPage()
    {
        $('.rule-item-button').removeClass('selected')

        var html = ""

        html += "<div class='rule-container'>" +
                "<div class='rule-summary-box'>" +
                    "<span class='summary-title'>Number of rules</span>" +
                    "<span class='summary-value'>" + this._ruleList.length + "</span>" +
                "</div> " +
            "</div>"

        $('#rule-editor').html(html);
    }

    _renderRule(x)
    {
        const className = 'indicator ' + (x.enabled ? 'enabled' : 'disabled')

        var html = '<button class="rule-item-button" onclick="ruleEditor.client.selectRule(' + x.id + ', event)">' +
            x.name +
            '<div class="' + className + '" />' +
            '</button>';
        return html;
    }

    _renderRuleEditor()
    {
        var html = ""

        html += "<div class='rule-container'>" +
                    this.renderEditorTitle() +
                    "<div class='field'>" +
                        "<div class='label-wrapper'> " +
                                "<label>Name</label>" +
                        "</div>" +
                        "<input class='field-input name' name='name' oninput='ruleEditor.client.changeRule(event.target.value, event.target.name, event.target)' required />" +
                    "</div>" +

                    "<div class='field'>" +
                        "<div class='label-wrapper'> " +
                            "<label>Target</label>" +
                        "</div>" +
                        "<input class='field-input target' name='target' oninput='ruleEditor.client.changeRule(event.target.value, event.target.name, event.target)' required />" +
                    "</div>" +

                    "<div class='field'>" +
                        "<div class='label-wrapper'> " +
                            "<label>Rule script</label>" +
                        "</div>" +
                        "<textarea id='script' class='field-input script' name='script' required />" +
                    "</div>" +
                    "<label class='checkbox-container'>Enable/Disable" +
                        "<input type='checkbox'  onclick='ruleEditor.client.changeEnable()' class='enable-checkbox' />" +
                        "<span class='checkmark'></span>" +
                    "</label> " +
                "<div class='btn-group'>" +
                    this.renderButtons() +
                "</div>" +
            "</div>"

        $('#rule-editor').html(html);

        $('.field-input.name').val(this._selectedRule.name)
        $('.field-input.target').val(this._selectedRule.target)
        $('.field-input.script').val(this._selectedRule.script)
        $('.enable-checkbox').prop('checked', this._selectedRule.enabled)

        const codeMirror = CodeMirror.fromTextArea(document.getElementById('script'), {
            mode: 'javascript',
            smartIntend: true,
            theme: 'darcula',
            extraKeys: { 'Ctrl-Space': 'autocomplete' }
        })

        codeMirror.on('change', editor => {
            ruleEditor.client.changeRule(editor.getValue(), 'script', 'script')
        })

        codeMirror.on('keyup', function (cm, event) {
            if (!cm.state.completionActive && event.keyCode > 64 && event.keyCode < 91) {
                CodeMirror.commands.autocomplete(cm, null, { completeSingle: false })
            }
        })

    }

    renderEditorTitle()
    {
        var html = ""

        if (this.isEmptyFields()) {
            html += "<div class='editor-title'>Create new rule</div>"
        } else {
            html += "<div class='editor-title'>Edit rule</div>"
        }

        return html
    }

    renderButtons()
    {
        var html = ""

        if (this._selectedRule.id) {
            html += "<button class='rule-btn' onclick='ruleEditor.client.deleteRule()'>Delete</button>" +
                "<button class='rule-btn' onclick='ruleEditor.client.openSummary()'>Cancel</button>" +
                "<button class='rule-btn save-btn' onclick='ruleEditor.client.saveRule()'>Save</button>"

        } else {
            html += "<button class='btn create-btn' onclick='ruleEditor.client.createRule()' disabled>Create</button>"
        }

        return html
    }

    selectRule(id, event)
    {
        backendFetchRule(id, data => {
            this._selectedRule = { ...data }
            this._renderRuleEditor()

            $('.rule-item-button').removeClass('selected')
            $(event.target).addClass('selected')
        })
    }

    setSelectedImport(value)
    {
        this._deleteExtra = value
        $('.import-options').css('display', 'none')
        $('.label-text').html(this._deleteExtra ? 'Import' : 'Restore')
    }

    createNewRule()
    {
        this._selectedRule = { name: '', enabled: true, target: '', script: '' }
        this._renderRuleEditor()
    }

    changeRule(value, field, target)
    {
        this._selectedRule[field] = value

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
        this._selectedRule.enabled = !this._selectedRule.enabled
    }

    saveRule()
    {
        backendUpdateRule(this._selectedRule.id, this._selectedRule, () => {
            this.refresh()
        })
    }

    deleteRule()
    {
        backendDeleteRule(this._selectedRule.id, () => {
            this._selectedRule = null
            this.refresh()
        })
    }

    createRule()
    {
        backendCreateRule(this._selectedRule, () => {
            this.refresh()
        })
    }

    export()
    {
        backendExportRules(response => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response))
            const exportElem = document.getElementById('exportAnchor')
            exportElem.setAttribute('href', dataStr)
            exportElem.setAttribute('download', 'rules.json')
            exportElem.click()
        })
    }

    uploadFile()
    {
        const input = document.getElementById('upload-rule')

        if (input.files.length === 0) {
            console.error('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            backendImportRules({
                data: JSON.parse(reader.result),
                deleteExtra: this._deleteExtra
            }, () => {
                this.refresh()
                this._renderRuleMainPage()
            })
        };

        reader.readAsText(input.files[0]);
    }

    openSummary()
    {
        this._selectedRule = null
        this._renderRuleMainPage()
    }

    isEmptyFields()
    {
        return Object.values(this._selectedRule).some(item => item === '')
    }
}

ruleEditor.client = new RuleEditor();

