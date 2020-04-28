function fetchDiagram(cb) {
    Logger.info("[fetchDiagram] ");
    return backend.get('/api/tree')
        .then(result => {
            cb(result.data);
        })
}

function fetchAssets(dn, cb) {
    Logger.info("[fetchAssets] %s", dn);
    return backend.get('/api/assets', { dn: dn })
        .then(result => {
            cb(result.data);
        })
}

function fetchSearchResults(criteria, cb) {
    Logger.info("[fetchSearchResults] ", criteria);
    return backend.get('/api/search', { criteria: criteria })
        .then(result => {
            cb(result.data);
        })
}  
  
function fetchAbout(cb) {
    Logger.info("[fetchAbout]");
    return backend.get('/about')
        .then(result => {
            cb(result.data);
        });
}  
  
function fetchHistoryRange(cb) {
    Logger.info("[fetchHistoryRange]");
    return backend.get('/api/v1/history/range')
        .then(result => {
            cb(result.data);
        });
}  
  
function fetchHistoryTimeline(from, to, cb) {
    Logger.info("[fetchHistoryTimeline] %s - %s", from, to);
    var params = {
        from: from,
        to: to
    };
    return backend.get('/api/v1/history/timeline', params)
        .then(result => {
            cb(result.data);
        });
}

function fetchHistorySnapshot(date, cb) {
    Logger.info("[fetchHistorySnapshot] %s", date);
    var params = {
        date: date
    };
    return backend.get('/api/v1/history/snapshot', params)
        .then(result => {
            cb(result.data);
        });
}

function fetchHistoryProperties(dn, date, cb) {
    Logger.info("[fetchHistoryProperties] %s :: %s", dn, date);
    var params = {
        dn: dn,
        date: date
    };
    return backend.get('/api/v1/history/assets', params)
        .then(result => {
            cb(result.data);
        });
}
  
function backendFetchPolicyList(cb) {
    Logger.info("[backendFetchPolicyList] ", );
    return backend.get('/api/v1/policy')
        .then(result => {
            cb(result.data);
        });
}

function backendFetchPolicy(id, cb) {
    Logger.info("[backendFetchPolicyList] %s", id);
    return backend.get('/api/v1/policy/' + id)
        .then(result => {
            cb(result.data);
        });
}

function backendCreatePolicy(policy, cb) {
    Logger.info("[backendCreatePolicy] ", policy);
    return backend.post('/api/v1/policy', policy)
        .then(result => {
            Logger.info("[backendCreatePolicy] Result: ", result.data);
            cb(result.data);
        });
}

function backendDeletePolicy(id, cb) {
    Logger.info("[backendDeletePolicy] %s", id);
    return backend.delete('/api/v1/policy/' + id)
        .then(result => {
            cb(result.data);
        });
}

function backendUpdatePolicy(id, config, cb) {
    Logger.info("[backendUpdatePolicy] %s", id, config);
    return backend.put('/api/v1/policy/' + id, config)
        .then(result => {
            Logger.info("[backendUpdatePolicy] Result: ", result.data);
            cb(result.data);
        });
}

function backendExportPolicies(cb) {
    Logger.info("[backendExportPolicies] %s");
    return backend.get('/api/v1/policy/export')
        .then(result => {
            Logger.info("[backendExportPolicies] Result: ", result.data);
            cb(result.data);
        });
}
