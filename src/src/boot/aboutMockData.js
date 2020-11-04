export const ABOUT_DATA = [
    {
        name: 'version',
        value: 'v4.5.6'
    },
    {
        name: 'backend version',
        value: 'v1.2.3'
    },
    {
        category: 'collector',
        name: 'parser version',
        value: 'v8.8.8'
    },
];

export const FEEDBACK_QUESTIONS = {
    "id": "1234-1234-123-123",
    "questions": [
        {
            "id": "ease-of-use",
            "type": "rate",
            "text": "How do you like the easy of use?"
        },
        {
            "id": "new-functionality",
            "type": "single-select",
            "text": "Is there some additional functionality you want to see in Kubevious?",
            "options": ["Yes", "No"]
        },
        {
            "id": "other-products",
            "type": "multi-select",
            "text": "What other tools do you use along with Kubevious? Check all that apply.",
            "options": ["kubectl", "Dashboard", "Lens", "Octant"]
        },
        {
            "id": "comments",
            "type": "input",
            "text": "Comment your Kubevious experience"
        },
    ]
}

export const NEW_VERSION_AVAILABLE_DATA = {
    "newVersionPresent": true,
    "name": "Kubevious",
    "version": "1.6.1",
    "url": "https://github.com/kubevious/kubevious",
    "changes": [
        "Rule editor. Define custom rules to continuously validate Kubernetes cluster and apps configurations.",
        "Marker editor. Associate custom markers to configurations using smart filters.",
        "Continuous diagram, properties alerts refresh upon changes.",
        "Frontend rewritten using React.",
        "Fixed issue related to preparing sql statements after connection restart. #12, #25",
        "Fixed issue related to DB initialization. #16",
        "Fixed issue with timeline contents getting disappeared after window reopen. #17",
        "Fixed UI crash on startup. kubevious/helm#7",
    ],
    "features": [
        "Rules editor",
        "Markers editor",
        "Diagram autorefresh"
    ],
    "feedbackRequest": FEEDBACK_QUESTIONS
}

export const NO_NEW_VERSION_AVAILABLE_DATA = {
    "newVersionPresent": false,
    "feedbackRequest": FEEDBACK_QUESTIONS
}
