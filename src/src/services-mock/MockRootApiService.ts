import _ from "the-lodash"

import { MockDiagramService } from "./MockDiagramService"
import { MockWebSocketService } from "./MockWebSocketService"
import { MockRuleService } from "./MockRuleService"
import { MockMarkerService } from "./MockMarkerService"
import { MockMiscService } from "./MockMiscService"

import { app } from "@kubevious/ui-framework"

export class MockRootApiService {
    constructor() {
        const sharedState = app.sharedState

        app.registerService({ kind: "socket" }, () => {
            return new MockWebSocketService(this, sharedState)
        })

        app.registerService({ kind: "rule" }, () => {
            return new MockRuleService(this, sharedState)
        })

        app.registerService({ kind: "marker" }, () => {
            return new MockMarkerService(this, sharedState)
        })

        app.registerService({ kind: "diagram" }, () => {
            return new MockDiagramService(this, sharedState)
        })

        app.registerService({ kind: "misc" }, () => {
            return new MockMiscService(this, sharedState)
        })
    }

    socketService() {
        return app.serviceRegistry.resolveService<MockWebSocketService>({
            kind: "socket",
        })
    }

    ruleService() {
        return app.serviceRegistry.resolveService<MockRuleService>({
            kind: "rule",
        })
    }

    markerService() {
        return app.serviceRegistry.resolveService<MockMarkerService>({
            kind: "marker",
        })
    }

    diagramService(params) {
        let info
        if (params) {
            info = _.clone(params)
        } else {
            info = {}
        }
        info.kind = "diagram"
        return app.serviceRegistry.resolveService<MockDiagramService>(info)
    }

    miscService() {
        return app.serviceRegistry.resolveService<MockMiscService>({
            kind: "misc",
        })
    }
}
