import { WebSocketEndpointInfo } from '@kubevious/ui-dev-tools';
import { WebSocketKind } from '@kubevious/ui-middleware';

export const WEBSOCKET_ENDPOINTS: WebSocketEndpointInfo[] = [
    
    {
        name: 'Reporting Status',
        query: { kind: 'socket' },
        target: { kind: WebSocketKind.cluster_reporting_status },
    },
    
    {
        name: 'Latest Snapshot',
        query: { kind: 'socket' },
        target: { kind: WebSocketKind.latest_snapshot_id },
    },

    {
        name: 'Diagram Node',
        query: { kind: 'socket' },
        context: { snapshotId: "" },
        target: { kind: WebSocketKind.node, dn: "" },
    },
    {
        name: 'Diagram Children',
        query: { kind: 'socket' },
        context: { snapshotId: "" },
        target: { kind: WebSocketKind.children, dn: "" },
    },
    {
        name: 'Diagram Properties',
        query: { kind: 'socket' },
        context: { snapshotId: "" },
        target: { kind: WebSocketKind.props, dn: "" },
    },
    {
        name: 'Diagram Alerts',
        query: { kind: 'socket' },
        context: { snapshotId: "" },
        target: { kind: WebSocketKind.alerts, dn: "" },
    },


    {
        name: 'Rules',
        query: { kind: 'socket' },
        target: { kind: WebSocketKind.rules_list },
    },
    {
        name: 'Rules Statuses',
        query: { kind: 'socket' },
        target: { kind: WebSocketKind.rules_statuses },
    },
    {
        name: 'Rule Results',
        query: { kind: 'socket' },
        target: { kind: WebSocketKind.rule_result, name: "" },
    },

    {
        name: 'Markers',
        query: { kind: 'socket' },
        target: { kind: WebSocketKind.markers_list },
    },
    {
        name: 'Markers Statuses',
        query: { kind: 'socket' },
        target: { kind: WebSocketKind.markers_statuses },
    },
    {
        name: 'Marker Results',
        query: { kind: 'socket' },
        target: { kind: WebSocketKind.marker_result },
    },

    {
        name: 'Worldvious Updates',
        query: { kind: 'socket' },
        target: { kind: WebSocketKind.worldvious_updates },
    },

];
