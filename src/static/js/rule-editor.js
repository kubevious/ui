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
            if (!$(e.target).closest('.rule-header').length) {
                $('#import-container').css('display', 'none')
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
        this._renderRules();

        if (this._ruleList.length === 0) {
            this._renderStartPage()
        } else {
            this._renderRuleMainPage()
        }
    }

    _renderStartPage()
    {
        var html = "<div class='start-rule-container'>" +
                "<div class='start-wrapper'>" +
                    "<div class='start-text'>You have no rules defined. Time to create your new rule:</div>" +
                    "<div class='start-btn-wrapper'>" +
                        "<button class='button success new-rule-btn' onclick='ruleEditor.client.createNewRule()'>" +
                            "<div class='plus'>+</div> New Rule" +
                        "</button> " +
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
                    "<div class='btn-group'>" +
                        "<button class='button success new-rule-btn' onclick='ruleEditor.client.createNewRule()'>" +
                            "<div class='plus'>+</div> New Rule" +
                        "</button> " +
                        "<button class='button square light export' onclick='ruleEditor.client.export()'>" +
                            "<i class='fas fa-download'></i>" +
                        "</button>" +
                        "<a id='exportAnchor' style='display:none' />" +

                        "<button class='button square light' onclick='ruleEditor.client._renderExportOptions()'>" +
                            "<i class='fas fa-undo'></i>" +
                        "</button>" +
                    "</div>" +
                "</div>" +
                "<div class='rules'>"

        for(var x of this._ruleList)
        {
            html += this._renderRule(x)
        }
        html += "</div>" +

        $('#rule-list').html(html);

        $('.button.export').prop('disabled', this._ruleList.length === 0)
    }

    _renderExportOptions()
    {
        var html = ""

        html+= "<div id='import-container'>" +
            "<div class='import-caret'></div>"+
            "<div class='import-options'>" +
                    "<div class='option' onclick='ruleEditor.client.setSelectedImport(true)'>" +
                        "<label for='upload-rule' class='option-desc'>" +
                            "<b>Restore</b> from backup" +
                        "</label>" +
                    "</div>" +
                    "<div class='option' onclick='ruleEditor.client.setSelectedImport(false)'>" +
                        "<label for='upload-rule' class='option-desc'>" +
                            "<b>Merge</b> from backup preserving existing roles" +
                        "</div>" +
                "</div>" +
            "<input type='file' id='upload-rule' name='upload-rule' onchange='ruleEditor.client.uploadFile()' />" +
            "</div>" +
            "</div>"

        $('#rule-editor').append(html);
    }

    _renderRuleMainPage()
    {
        $('.rule-item-button').removeClass('selected')

        var html = ""

        html += "<div class='rule-container main'>" +
                    'No selected rule' +
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
                        "<textarea id='target' class='field-input target' name='target' required />" +
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

        const targetCodeMirror = CodeMirror.fromTextArea(document.getElementById('target'), {
            smartIntend: true,
            theme: 'darcula',
            extraKeys: { 'Ctrl-Space': 'autocomplete' },
            hintOptions: {globalScope: {

                }}
        })

        targetCodeMirror.on('change', editor => {
            ruleEditor.client.changeRule(editor.getValue(), 'target', 'target')
        })

        targetCodeMirror.on('keyup', function (cm, event) {
            if (!cm.state.completionActive && event.keyCode > 64 && event.keyCode < 91) {
                snippet()
            }
        })

        const snippets = [
            { text: 'select', displayText: 'select' },
            { text: 'resource', displayText: 'resource' },
            { text: 'child', displayText: 'child' },
            { text: 'descendant', displayText: 'descendant' },
            { text: 'filter', displayText: 'filter' },
            { text: 'labels', displayText: 'labels' },
            { text: 'label', displayText: 'label' },
            { text: 'name', displayText: 'name' },
            { text: 'debugOutput', displayText: 'debugOutput' },
        ]

        function snippet() {
            CodeMirror.showHint(targetCodeMirror, function () {
                const cursor = targetCodeMirror.getCursor()
                const token = targetCodeMirror.getTokenAt(cursor)
                const start = token.start
                const end = cursor.ch
                const line = cursor.line
                const currentWord = token.string

                const list = snippets.filter(function (item) {
                    return item.text.indexOf(currentWord) >= 0
                })

                return {
                    list: list.length ? list : snippets,
                    from: CodeMirror.Pos(line, start),
                    to: CodeMirror.Pos(line, end)
                }
            }, { completeSingle: false })
        }

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
            html += "<button class='button' onclick='ruleEditor.client.deleteRule()'>Delete</button>" +
                "<button class='button' onclick='ruleEditor.client.openSummary()'>Cancel</button>" +
                "<button class='button success' onclick='ruleEditor.client.saveRule()'>Save</button>"

        } else {
            html += "<button class='button success create-btn' onclick='ruleEditor.client.createRule()' disabled>Create</button>"
        }

        return html
    }

    _renderSuccessPage()
    {
        var html = "<div class='rule-container main success'>" +
                        "<i class='fas fa-check' />" +
                        'Role successfully saved' +
                    "</div>"

        $('#rule-editor').html(html)
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
        $('#import-container').css('display', 'none')
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
        backendUpdateRule(this._selectedRule.id, this._selectedRule, (data) => {
            this._renderSuccessPage()

            setTimeout(() => {
                this.refresh()
            }, 1000)
        })
    }

    deleteRule()
    {
        backendDeleteRule(this._selectedRule.id, (data) => {
            this._selectedRule = null
            this.refresh()
        })
    }

    createRule()
    {
        backendCreateRule(this._selectedRule, (data) => {
            this._renderSuccessPage()

            setTimeout(() => {
                this.refresh()
            }, 1000)
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

