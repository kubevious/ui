function showObjectAlerts(node, alerts)
{
    Logger.info("[showObjectAlerts] ", node.data.dn, alerts);
    if (!alerts) {
        alerts = [];
    }

    renderTable($("#alerts"), alerts,
        [
            {
                label: '',
                name: 'severity',
                formatter: x => '<div class="alert-item ' + x + '"></div>'
            }, {
                label: 'Date',
                name: 'date',
                formatter: x => formatDate(x)
            }, {
                label: 'Message',
                name: 'msg'
            }
        ])
}