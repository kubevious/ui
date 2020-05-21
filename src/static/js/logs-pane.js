function showObjectAlerts(dn, alerts)
{
    Logger.info("[showObjectAlerts] %s", dn, alerts);
    _renderAlertsTable(alerts)
}

function clearObjectAlerts()
{
    Logger.info("[clearObjectAlerts] ");

    _renderAlertsTable([])
}


function _renderAlertsTable(alerts)
{
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
                label: 'Message',
                name: 'msg'
            }
        ])
}


$(document).on("layout-open-alertsComponent", function(e){
    // TODO: handle case of alerts reopen.
    clearObjectAlerts();
});
