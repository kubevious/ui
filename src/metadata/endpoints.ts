import { EndpointInfo } from '@kubevious/ui-dev-tools';
import { HttpMethod } from '@kubevious/ui-framework';

export const ENDPOINTS: EndpointInfo[] = [

    {
        name: '/auth/project/list',
        method: HttpMethod.GET,
    },
    {
        name: '/auth/project/login',
        method: HttpMethod.POST,
        sample: {
            body: {
                project: '',
            },
        },
    },
    {
        name: '/auth/user/initialize',
        method: HttpMethod.POST,
    },
    {
        name: '/auth/user/check-ready',
        method: HttpMethod.GET,
    },

    {
        name: '/auth/user/profile',
        method: HttpMethod.GET,
    },
    {
        name: '/auth/user/profile',
        method: HttpMethod.POST,
        sample: {
            body: {
                first_name: 'Chuck',
                last_name: 'Norris',
                company: 'Coke',
            },
        },        
    },

    {
        name: '/project/summary',
        method: HttpMethod.GET,
    },
    {
        name: '/project/clusters',
        method: HttpMethod.GET,
    },
    {
        name: '/project/cluster/config',
        method: HttpMethod.GET,
        params: ['cluster'],
    },
    {
        name: '/project/cluster/config',
        method: HttpMethod.POST,
        params: ['cluster'],
        sample: {
            params: {
                cluster: '1e5b8f03e71e4a0a8032e468c8424db5',
            },
            body: {
                "name": "cluster-1234",
                "purpose": [
                  "Production"
                ],
                "location": "us-east1",
                "provider": "gcp",
                "description": "This is our test cluster."
              }
        },  
    },
    {
        name: '/project/cluster/token',
        method: HttpMethod.GET,
        params: ['cluster'],
    },
    {
        name: '/project/cluster/token',
        method: HttpMethod.POST,
        params: ['cluster'],
    },
    {
        name: '/project/cluster/reporting_status',
        method: HttpMethod.GET,
        params: ['cluster'],
    },
    {
        name: '/project/rule-engine/rules',
        method: HttpMethod.GET,
    },
    {
        name: '/project/rule-engine/rule',
        method: HttpMethod.GET,
        params: ['rule'],
    },
    {
        name: '/project/rule-engine/rule',
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
        name: '/project/rule-engine/rule',
        method: HttpMethod.DELETE,
        params: ['rule'],
    },
    {
        name: '/project/rule-engine/rules-statuses',
        method: HttpMethod.GET,
    },
    {
        name: '/project/rule-engine/rule-result',
        method: HttpMethod.GET,
        params: ['rule'],
    },
    {
        name: '/project/rule-engine/export-rules',
        method: HttpMethod.GET,
        params: [],
    },
    {
        name: '/project/rule-engine/import-rules',
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
        name: '/project/rule-engine/markers',
        method: HttpMethod.GET,
        params: [],
    },
    {
        name: '/project/rule-engine/marker',
        method: HttpMethod.GET,
        params: ['marker'],
    },
    {
        name: '/project/rule-engine/marker',
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
        name: '/project/rule-engine/marker',
        method: HttpMethod.DELETE,
        params: ['marker'],
    },
    {
        name: '/project/rule-engine/marker-statuses',
        method: HttpMethod.GET,
    },
    {
        name: '/project/rule-engine/marker-result',
        method: HttpMethod.GET,
        params: ['marker'],
    },
    {
        name: '/project/rule-engine/export-markers',
        method: HttpMethod.GET,
        params: [],
    },
    {
        name: '/project/rule-engine/import-markers',
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
        name: '/project/validators',
        method: HttpMethod.GET
    },
    {
        name: '/project/validators/get',
        method: HttpMethod.GET,
        params: ['validator']
    },
    {
        name: '/project/validators/set',
        method: HttpMethod.POST,
        sample: {
            body: {
                validator: 'API_SERVICE_DISCONNECTED',
                setting: 'error'
            },
        },
    },

    {
        name: '/project/metrics',
        method: HttpMethod.GET
    },
    {
        name: '/project/cluster/metrics',
        method: HttpMethod.GET,
        params: ['cluster'],
    },

    {
        name: '/cluster/latest_snapshot',
        method: HttpMethod.GET,
        params: ['cluster'],
    },
    {
        name: '/cluster/snapshots',
        method: HttpMethod.GET,
        params: ['cluster'],
    },

    {
        name: '/cluster/snapshot/diagram/node',
        method: HttpMethod.GET,
        params: ['cluster', 'snapshot', 'dn'],
    },
    {
        name: '/cluster/snapshot/diagram/children',
        method: HttpMethod.GET,
        params: ['cluster', 'snapshot', 'dn'],
    },
    {
        name: '/cluster/snapshot/diagram/props',
        method: HttpMethod.GET,
        params: ['cluster', 'snapshot', 'dn'],
    },
    {
        name: '/cluster/snapshot/diagram/alerts',
        method: HttpMethod.GET,
        params: ['cluster', 'snapshot', 'dn'],
    },
    {
        name: '/cluster/snapshot/diagram/self_alerts',
        method: HttpMethod.GET,
        params: ['cluster', 'snapshot', 'dn'],
    },

    {
        name: '/cluster/history/timeline_preview',
        method: HttpMethod.GET,
        params: ['cluster'],
    },
    {
        name: '/cluster/history/timeline',
        method: HttpMethod.GET,
        params: ['cluster', 'from', 'to'],
    },
    {
        name: '/cluster/history/snapshot_at_date',
        method: HttpMethod.GET,
        params: ['cluster', 'date'],
    },

    // 8b2356d69a614c5b9b83c1f0444eb915
    {
        name: '/cluster/history/node',
        method: HttpMethod.GET,
        params: ['cluster', 'dn'],
    },
    {
        name: '/cluster/history/hierarchy',
        method: HttpMethod.GET,
        params: ['cluster', 'dn'],
    },


    {
        name: '/project/help/request',
        method: HttpMethod.POST,
        params: [],
        sample: {
            body: {
                request_type: "Problem",
                subject: "We need help",
                description: "Have issues with cluster editor",
                priority: "Medium"
            },
        },
    },

    {
        name: '/slack/installation',
        method: HttpMethod.GET,
        params: [],
    },
    {
        name: '/slack/disconnect',
        method: HttpMethod.POST,
        params: [],
    },
    {
        name: '/slack/subscriptions',
        method: HttpMethod.GET,
        params: [],
    },
    {
        name: '/slack/delete_subscription',
        method: HttpMethod.POST,
        params: [],
        sample: {
            body: {
                channelId: 'C-1234',
                config: {
                    type: 'rules'
                }
            },
        },
    },

    {
        name: '/project/info',
        method: HttpMethod.GET,
    },
    {
        name: '/project/team/list',
        method: HttpMethod.GET,
    },
    {
        name: '/project/team/add',
        method: HttpMethod.POST,
        params: [],
        sample: {
            body: {
                email: 'rubenhak@gmail.com',
            },
        },
    },
    {
        name: '/project/team/remove',
        method: HttpMethod.POST,
        params: [],
        sample: {
            body: {
                email: 'rubenhak@gmail.com',
            },
        },
    },

    {
        name: '/auth/billing/details',
        method: HttpMethod.GET,
    },
    {
        name: '/auth/billing/portal',
        method: HttpMethod.GET,
    },
    
];
