function showObjectAlerts(node, alerts)
{
    Logger.info("[showObjectAlerts] ", node.data.id, alerts);
    if (!alerts) {
        alerts = [];
    }

    renderTable($("#alerts"), alerts,
        [
            {
                name: '',
                value: x => '<div class="alert-item ' + x.severity  + '"></div>'
            }, {
                name: 'Date',
                value: x => x.date
            }, {
                name: 'Message',
                value: x => x.msg
            }
        ])
}