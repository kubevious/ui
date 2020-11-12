export const FILTERS_LIST = [
    {
        payload: 'kind',
        shownValue: 'Kind',
        values: [
            {
                title: 'Pod',
                payload: 'pod'
            },
            {
                title: 'Ingress',
                payload: 'ingress'
            },
            {
                title: 'Service',
                payload: 'service'
            },
            {
                title: 'Config Map',
                payload: 'configmap'
            },
            {
                title: 'Volume',
                payload: 'vol'
            },
            {
                title: 'Role',
                payload: 'rl'
            },
            {
                title: 'Replica Set',
                payload: 'replicaSet'
            },
            {
                title: 'Container',
                payload: 'cont'
            },
        ]
    },
    {
        payload: 'api',
        shownValue: 'Api Group',
        values: [
            {
                title: 'v1',
                payload: 'v1'
            },
            {
                title: 'api/v1',
                payload: 'api/v1'
            }
        ]
    },
    {
        payload: 'label',
        shownValue: 'Label',
        values: [
            {
                title: '1',
                payload: '1'
            },
            {
                title: '2',
                payload: '2'
            }
        ]
    },
    {
        payload: 'errors',
        shownValue: 'Errors',
        values: [
            {
                title: 'All with errors',
                payload: 'true'
            },
            {
                title: '1',
                payload: '1'
            },
            {
                title: '2',
                payload: '2'
            },
            {
                title: '3',
                payload: '3'
            },
            {
                title: 'More than 3',
                payload: '4'
            }
        ]
    },
    {
        payload: 'warnings',
        shownValue: 'Warnings',
        values: [
            {
                title: 'All with warnings',
                payload: 'true'
            },
            {
                title: '1',
                payload: '1'
            },
            {
                title: '2',
                payload: '2'
            },
            {
                title: '3',
                payload: '3'
            },
            {
                title: 'More than 3',
                payload: '4'
            }
        ]
    },
    {
        payload: 'annotations',
        shownValue: 'Annotations',
        values: [
            {
                title: '1',
                payload: '1'
            },
            {
                title: '2',
                payload: '2'
            }
        ]
    },
    {
        payload: 'markers',
        shownValue: 'Markers',
        values: [{
            title: 'All with markers',
            payload: 'true'
        }]
    },
]
