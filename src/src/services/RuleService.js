
class RuleService {
    constructor(client)
    {
        this._client = client;
    }

    backendFetchRuleList(cb) {
        return this._client.get('/rule')
            .then(result => {
                cb(result.data);
            });
    }

    backendFetchRule(id, cb) {
        return this._client.get('/rule/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendCreateRule(rule, cb) {
        return this._client.post('/rule', rule)
            .then(result => {
                cb(result.data)
            });
    }

    backendDeleteRule(id, cb) {
        return this._client.delete('/rule/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendUpdateRule(id, config, cb) {
        return this._client.put('/rule/' + id, config)
            .then(result => {
                cb(result.data);
            });
    }

    backendExportItems(cb) {
        return this._client.get('/rule/export')
            .then(result => {
                cb(result.data);
            });
    }

    backendImportRules(policies, cb) {
        return this._client.post('/rule/import', policies)
            .then(result => {
                cb(result.data);
            });
    }
}

export default RuleService