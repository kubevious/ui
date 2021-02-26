export type Annotations = {
    metadata: Metadata
    kind: string
    spec: {
        type: string
        ports: [
            {
                port: number
                protocol: string
                targetPort: number
            }
        ]
        selector: {
            app: string
        }
        clusterIP: string
        sessionAffinity: string
    }
    status: {
        loadBalancer: {}
    }
}

export type Metadata = {
    uid: string
    name: string
    labels: {
        name: string
    }
    selfLink: string
    namespace: string
    annotations: {
        [name: string]: string
    }
    resourceVersion: string
    creationTimestamp: Date
    apiVersion: string
    kind: string
}
