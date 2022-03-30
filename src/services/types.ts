export enum WebSocketKind
{
    node = 'node',
    children = 'children',
    props = 'props',
    alerts = 'alerts',

    latest_snapshot_id = 'latest_snapshot_id',

    rules_list = 'rules-list',
    rules_statuses = 'rules-statuses',
    rule_result = 'rule-result',
    markers_list = 'markers-list',
    markers_statuses = 'markers-statuses',
    marker_result = 'marker-result',

    cluster_reporting_status = 'cluster_reporting_status'
}