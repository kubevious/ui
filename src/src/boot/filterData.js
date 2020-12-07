export const FILTERS_LIST = [
    {
        payload: 'labels',
        shownValue: 'Labels',
        values: [
            {
                title: 'Label',
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
                title: 'Annotation',
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
                title: 'With errors',
                payload: 'true'
            },
            {
                title: 'Without errors',
                payload: 'false'
            }
        ]
    },
    {
        payload: 'warn',
        shownValue: 'Warnings',
        values: [
            {
                title: 'With warnings',
                payload: 'true'
            },
            {
                title: 'Without warnings',
                payload: 'false'
            }
        ]
    },
]
