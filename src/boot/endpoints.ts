import { HttpMethod } from '@kubevious/ui-framework';

export interface EndpointSample {
    body?: any;
}

export interface EndpointInfo {
    name: string;
    method: HttpMethod;
    params?: string[];
    sample?: EndpointSample;
}

export const ENDPOINTS: (string | EndpointInfo)[] = [
    '/usage/total/deployments',
    '/usage/total/deployments_simple',
    '/usage/total/version_history',
    {
        name: '/usage/deployment/version_history',
        method: HttpMethod.GET,
        params: ['deployment'],
    },
    {
        name: '/usage/deployment/location',
        method: HttpMethod.GET,
        params: ['deployment'],
    },
    {
        name: '/usage/deployment/errors/history',
        method: HttpMethod.GET,
        params: ['deployment'],
    },
    {
        name: '/usage/deployment/metrics/history',
        method: HttpMethod.GET,
        params: ['deployment'],
    },
    '/admin/users',
    '/admin/projects',
    {
        name: '/admin/user/projects',
        method: HttpMethod.GET,
        params: ['user'],
    },
    '/admin/clusters',

    {
        name: '/project/clusters',
        method: HttpMethod.GET,
        params: ['project'],
    },
    {
        name: '/project/cluster/config',
        method: HttpMethod.GET,
        params: ['project', 'cluster'],
    },
    {
        name: '/project/cluster/config',
        method: HttpMethod.POST,
        params: ['project', 'cluster'],
        sample: {
            body: {
                name: 'cluster-01',
                provider: 'aws',
                location: 'us-east-1',
                purpose: ['prod', 'staging'],
                description: 'My prod cluster',
            },
        },
    },
    {
        name: '/project/cluster/token',
        method: HttpMethod.GET,
        params: ['project', 'cluster'],
    },
    {
        name: '/project/cluster/token',
        method: HttpMethod.POST,
        params: ['project', 'cluster'],
    },
    {
        name: '/project/rule-engine/rules',
        method: HttpMethod.GET,
        params: ['project'],
    },
    {
        name: '/project/rule-engine/rule',
        method: HttpMethod.GET,
        params: ['project', 'rule'],
    },
    {
        name: '/project/rule-engine/rule',
        method: HttpMethod.POST,
        params: ['project', 'rule'],
    },
    {
        name: '/project/rule-engine/rule',
        method: HttpMethod.DELETE,
        params: ['project', 'rule'],
    },
    {
        name: '/project/rule-engine/rules-statuses',
        method: HttpMethod.GET,
        params: ['project'],
    },
    {
        name: '/project/rule-engine/rule-result',
        method: HttpMethod.GET,
        params: ['project', 'rule'],
    },

    {
        name: '/project/rule-engine/markers',
        method: HttpMethod.GET,
        params: ['project'],
    },
    {
        name: '/project/rule-engine/marker',
        method: HttpMethod.GET,
        params: ['project', 'marker'],
    },
    {
        name: '/project/rule-engine/marker',
        method: HttpMethod.POST,
        params: ['project', 'marker'],
    },
    {
        name: '/project/rule-engine/marker',
        method: HttpMethod.DELETE,
        params: ['project', 'marker'],
    },
    {
        name: '/project/rule-engine/marker-statuses',
        method: HttpMethod.GET,
        params: ['project'],
    },
    {
        name: '/project/rule-engine/marker-result',
        method: HttpMethod.GET,
        params: ['project', 'marker'],
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
];
