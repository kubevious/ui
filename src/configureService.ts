import { RootApiFactory } from "./services/RootApiFactory"
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


export function setupApiFactory(): RootApiFactory {
    console.log("[setupApiFactory]");
    const factory = new RootApiFactory();
    return factory;
}

// new KubeviousHandler()
