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