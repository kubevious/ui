import { SharedState } from "@kubevious/ui-framework"

export function setupDevTools(sharedState: SharedState)
{
    if (process.env.REACT_APP_ENABLE_DEV_TOOLS) {
        sharedState.set('dev_tools_enabled', true);
    }
    
    (window as any).openDevTools = () => {
        sharedState.set('dev_tools_enabled', true);
    }

    (window as any).closeDevTools = () => {
        sharedState.set('dev_tools_enabled', false);
    }
}