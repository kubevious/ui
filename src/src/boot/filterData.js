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
        payload: 'labels',
        shownValue: 'Labels',
        values: [
            {
                title: 'Key',
                payload: 'key'
            },
            {
                title: 'Value',
                payload: 'value'
            }
        ]
    },
    {
        payload: 'annotations',
        shownValue: 'Annotations',
        values: [
            {
                title: 'Key',
                payload: 'key'
            },
            {
                title: 'Value',
                payload: 'value'
            }
        ]
    },
    {
        payload: 'error',
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
                payload: 'more'
            }
        ]
    },
    {
        payload: 'warn',
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
                payload: 'more'
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
