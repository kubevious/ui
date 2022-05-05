import { RootApiFactory } from "./services/RootApiFactory"
import { setupDevTools } from "./logic/dev-tools-initializer"
import { setupSharedState } from "./logic/shared-state-initializer"
import { setupProperties } from "./components/Properties/setup"

import { app } from "@kubevious/ui-framework"

export const sharedState = app.sharedState;

setupDevTools(sharedState);
setupSharedState(sharedState);
setupProperties();

sharedState.init();

export function setupApiFactory(): RootApiFactory {
    console.log("[setupApiFactory]");
    const factory = new RootApiFactory();
    return factory;
}
