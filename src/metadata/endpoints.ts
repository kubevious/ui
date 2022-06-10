import { EndpointInfo } from '@kubevious/ui-dev-tools';
import { HttpMethod } from '@kubevious/ui-framework';

export const ENDPOINTS: EndpointInfo[] = [


    {
        name: '/rule-engine/rules',
        method: HttpMethod.GET,
    },
    {
        name: '/rule-engine/rule',
        method: HttpMethod.GET,
        params: ['rule'],
    },
    {
        name: '/rule-engine/rule',
        method: HttpMethod.POST,
        params: ['rule'],
        sample: {
            params: {
                rule: 'rule-1',
            },
            body: {
                name: 'rule-1',
                target: "select('Image')",
                script:
                    "if (item.props.tag == 'latest') { warning('You are using latest image tag. Please don't do that.''); }",
                enabled: true,
                applicator: {},
            },
        },
    },
    {
        name: '/rule-engine/rule',
        method: HttpMethod.DELETE,
        params: ['rule'],
    },
    {
        name: '/rule-engine/rules-statuses',
        method: HttpMethod.GET,
    },
    {
        name: '/rule-engine/rule-result',
        method: HttpMethod.GET,
        params: ['rule'],
    },
    {
        name: '/rule-engine/export-rules',
        method: HttpMethod.GET,
        params: [],
    },
    {
        name: '/rule-engine/import-rules',
        method: HttpMethod.POST,
        params: [],
        sample: {
            body: {
                deleteExtra: false,
                data: {
                    kind: 'rules',
                    items: [
                        {
                            applicator: {},
                            enabled: true,
                            name: 'rule-1',
                            script:
                                "if (item.props.tag == 'latest') { warning('You are using latest image tag. Please don't do that.''); }",
                            target: "select('Image')",
                        },
                        {
                            applicator: {},
                            enabled: true,
                            name: 'rule-2',
                            script:
                                "if (item.props.tag == 'latest') { warning('You are using latest image tag. Please don't do that.''); }",
                            target: "select('Image')",
                        },
                    ],
                },
            },
        },
    },

    {
        name: '/rule-engine/markers',
        method: HttpMethod.GET,
        params: [],
    },
    {
        name: '/rule-engine/marker',
        method: HttpMethod.GET,
        params: ['marker'],
    },
    {
        name: '/rule-engine/marker',
        method: HttpMethod.POST,
        params: ['marker'],
        sample: {
            params: {
                marker: 'large-namespace',
            },
            body: {
                name: 'large-namespace',
                shape: 'f447',
                color: '#61E48B',
                propagate: false,
            },
        },
    },
    {
        name: '/rule-engine/marker',
        method: HttpMethod.DELETE,
        params: ['marker'],
    },
    {
        name: '/rule-engine/markers-statuses',
        method: HttpMethod.GET,
    },
    {
        name: '/rule-engine/marker-result',
        method: HttpMethod.GET,
        params: ['marker'],
    },
    {
        name: '/rule-engine/export-markers',
        method: HttpMethod.GET,
        params: [],
    },
    {
        name: '/rule-engine/import-markers',
        method: HttpMethod.POST,
        params: [],
        sample: {
            body: {
                deleteExtra: false,
                data: {
                    kind: 'markers',
                    items: [
                        {
                            color: '#61E48B',
                            name: 'large-namespace',
                            shape: 'f447',
                            propagate: false,
                        },
                    ],
                },
            },
        },
    },

    {
        name: '/validators',
        method: HttpMethod.GET
    },
    {
        name: '/validators/get',
        method: HttpMethod.GET,
        params: ['validator']
    },
    {
        name: '/validators/set',
        method: HttpMethod.POST,
        sample: {
            body: {
                validator: 'API_SERVICE_DISCONNECTED',
                setting: 'error'
            },
        },
    },

    {
        name: '/metrics',
        method: HttpMethod.GET
    },

    {
        name: '/cluster/latest_snapshot',
        method: HttpMethod.GET,
    },
    {
        name: '/cluster/snapshots',
        method: HttpMethod.GET,
    },

    {
        name: '/diagram/node',
        method: HttpMethod.GET,
        params: ['snapshot', 'dn'],
    },
    {
        name: '/diagram/children',
        method: HttpMethod.GET,
        params: ['snapshot', 'dn'],
    },
    {
        name: '/diagram/props',
        method: HttpMethod.GET,
        params: ['snapshot', 'dn'],
    },
    {
        name: '/diagram/alerts',
        method: HttpMethod.GET,
        params: ['snapshot', 'dn'],
    },
    {
        name: '/diagram/self_alerts',
        method: HttpMethod.GET,
        params: ['snapshot', 'dn'],
    },

    {
        name: '/history/timeline_preview',
        method: HttpMethod.GET,
    },
    {
        name: '/history/timeline',
        method: HttpMethod.GET,
        params: ['from', 'to'],
    },
    {
        name: '/history/snapshot_at_date',
        method: HttpMethod.GET,
        params: ['date'],
    },
    {
        name: '/history/node',
        method: HttpMethod.GET,
        params: ['dn'],
    },
    {
        name: '/history/hierarchy',
        method: HttpMethod.GET,
        params: ['dn'],
    },

    {
        name: '/history/hierarchy',
        method: HttpMethod.GET,
        params: ['dn'],
    },

    {
        name: '/search/results',
        method: HttpMethod.POST,
        sample: {
            body: {
                criteria: 'git'
            },
        },
    },
    {
        name: '/search/labels',
        method: HttpMethod.POST,
        sample: {
            body: {
                criteria: 'kubernetes.io'
            },
        },
    },
    {
        name: '/search/labels/values',
        method: HttpMethod.POST,
        sample: {
            body: {
                key: 'kubernetes.io/name',
                criteria: 'git'
            },
        },
    },
    {
        name: '/search/annotations',
        method: HttpMethod.POST,
        sample: {
            body: {
                criteria: 'kubernetes.io'
            },
        },
    },
    {
        name: '/search/annotations/values',
        method: HttpMethod.POST,
        sample: {
            body: {
                key: 'kubernetes.io/name',
                criteria: 'git'
            },
        },
    },


    {
        name: '/cluster/reporting_status',
        method: HttpMethod.GET,
    },


    {
        name: '/guard/changes',
        method: HttpMethod.GET,
        params: ['last_id'],
    },
    {
        name: '/guard/change/details',
        method: HttpMethod.GET,
        params: ['id'],
    },
    
];
