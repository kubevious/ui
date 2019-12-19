function fetchDiagram(cb) {
    Logger.info("[fetchDiagram] ");
    return backend.get('/api/tree')
        .then(result => {
            cb(result.data);
        })
}

function fetchProperties(node, cb) {
    Logger.info("[fetchProperties] ", node.id);
    return backend.get('/api/properties', { dn: node.id })
        .then(result => {
            cb(result.data);
        })
}