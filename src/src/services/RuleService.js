
class RuleService {
    constructor(client)
    {
        this._client = client;
    }

    backendFetchRuleList(cb) {
        return this._client.get('/rules')
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

    backendCreateRule(rule, name, cb) {
        return this._client.post('/rule/' + name, rule)
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

    backendExportItems(cb) {
        return this._client.get('/rules/export')
            .then(result => {
                cb(result.data);
            });
    }

    backendImportRules(policies, cb) {
        return this._client.post('/rules/import', policies)
            .then(result => {
                cb(result.data);
            });
    }
}

export default RuleService
