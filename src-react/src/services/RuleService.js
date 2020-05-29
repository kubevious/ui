import BackendClient from './BackendClient'

class RuleService {
    backendFetchRuleList(cb) {
        return BackendClient.get('/api/v1/rule')
            .then(result => {
                cb(result.data);
            });
    }

    backendFetchRule(id, cb) {
        return BackendClient.get('/api/v1/rule/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendCreateRule(policy, cb) {
        return BackendClient.post('/api/v1/rule', policy)
            .then(result => {
                cb(result.data)
            });
    }

    backendDeleteRule(id, cb) {
        return BackendClient.delete('/api/v1/rule/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendUpdateRule(id, config, cb) {
        return BackendClient.put('/api/v1/rule/' + id, config)
            .then(result => {
                cb(result.data);
            });
    }

    backendExportRules(cb) {
        return BackendClient.get('/api/v1/rule/export')
            .then(result => {
                cb(result.data);
            });
    }

    backendImportRules(policies, cb) {
        return BackendClient.post('/api/v1/rule/import', policies)
            .then(result => {
                cb(result.data);
            });
    }
}

export default RuleService