const alertsEnum = Object.freeze({ 0: "at-most", 1: "at-least" })

export const FILTERS_LIST = [
    {
        payload: "labels",
        shownValue: "Labels",
        values: [
            {
                title: "Label",
                payload: "key",
            },
            {
                title: "Value",
                payload: "value",
            },
        ],
    },
    {
        payload: "annotations",
        shownValue: "Annotations",
        values: [
            {
                title: "Annotation",
                payload: "key",
            },
            {
                title: "Value",
                payload: "value",
            },
        ],
    },
    {
        payload: "error",
        shownValue: "Errors",
        values: [
            {
                title: "With errors",
                payload: {
                    kind: alertsEnum[1],
                    count: 1,
                },
            },
            {
                title: "Without errors",
                payload: {
                    kind: alertsEnum[0],
                    count: 0,
                },
            },
        ],
    },
    {
        payload: "warn",
        shownValue: "Warnings",
        values: [
            {
                title: "With warnings",
                payload: {
                    kind: alertsEnum[1],
                    count: 1,
                },
            },
            {
                title: "Without warnings",
                payload: {
                    kind: alertsEnum[0],
                    count: 0,
                },
            },
        ],
    },
]
