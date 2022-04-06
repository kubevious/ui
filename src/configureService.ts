import { RootApiFactory } from "./services/RootApiFactory"
import { setupDevTools } from "./logic/dev-tools-initializer"

import { app } from "@kubevious/ui-framework"

export const sharedState = app.sharedState;

setupDevTools(sharedState);
setupDevTools(sharedState);

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

sharedState.init();


export function setupApiFactory(): RootApiFactory {
    console.log("[setupApiFactory]");
    const factory = new RootApiFactory();
    return factory;
}

// new KubeviousHandler()
