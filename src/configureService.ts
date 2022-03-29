import { RootApiService } from "./services/RootApiService"
// import { KubeviousHandler } from "./state/kubevious-handler"

import { app } from "@kubevious/ui-framework"


app.sharedState.register("diagram_expanded_dns", {
    skipCompare: true,
    skipValueOutput: true,
})
app.sharedState.register("time_machine_timeline_data", {
    skipCompare: true,
    skipValueOutput: true,
})
app.sharedState.register("visible_windows", {
    skipCompare: true,
})

app.sharedState.init();


export const sharedState = app.sharedState


function apiFactory(): RootApiService {
    return new RootApiService()
}

export const api = apiFactory()


// new KubeviousHandler()
