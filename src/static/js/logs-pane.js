function showObjectAlerts(node, alerts)
{
    Logger.info("[showObjectAlerts] ", node.data.id, alerts);
    if (!alerts) {
        alerts = [];
    }

    renderTable($("#errors"), alerts,
        [{
            name: 'Date',
            value: x => x.date
        }, {
            name: 'Severity',
            value: x => x.severity
        }, {
            name: 'Message',
            value: x => x.msg
        }]
        )
}