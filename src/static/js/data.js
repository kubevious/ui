function fetchDiagram(cb) {
    Logger.info("[fetchDiagram] ");
    return backend.get('/api/tree')
        .then(result => {
            cb(result.data);
        })
}

function fetchProperties(node, cb) {
    Logger.info("[fetchProperties] ", node.dn);
    return backend.get('/api/properties', { dn: node.dn })
        .then(result => {
            cb(result.data);
        })
}

function fetchAlerts(node, cb) {
    Logger.info("[fetchAlerts] ", node.dn);
    return backend.get('/api/alerts', { dn: node.dn })
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
    Logger.info("[fetchHistoryTimeline]");
    return backend.get('/api/v1/history/timeline')
        .then(result => {
            cb(result.data);
        });
}