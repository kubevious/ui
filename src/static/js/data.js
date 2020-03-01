function fetchDiagram(cb) {
    Logger.info("[fetchDiagram] ");
    return backend.get('/api/tree')
        .then(result => {
            cb(result.data);
        })
}

function fetchProperties(dn, cb) {
    Logger.info("[fetchProperties] %s", dn);
    return backend.get('/api/properties', { dn: dn })
        .then(result => {
            cb(result.data);
        })
}

function fetchAlerts(dn, cb) {
    Logger.info("[fetchAlerts] %s", dn);
    return backend.get('/api/alerts', { dn: dn })
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
    return backend.get('/api/v1/history/props', params)
        .then(result => {
            cb(result.data);
        });
}
  