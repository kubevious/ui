import { SharedState } from "@kubevious/ui-framework"
import { CONFIRMATION_DIALOG_PARAMS_SHARED_KEY } from "@kubevious/ui-components"

export function setupSharedState(sharedState: SharedState)
{
    sharedState.register(CONFIRMATION_DIALOG_PARAMS_SHARED_KEY, {
        skipCompare: true,
        skipValueOutput: true,
    }) 
    
    sharedState.register("time_machine_timeline_data", {
        skipCompare: true,
        skipValueOutput: true,
    })
    sharedState.register("visible_windows", {
        skipCompare: true,
    })

    sharedState.register("selected_dn", {
        persistence: {
            kind: 'url',
            key: 'sd',
            base64: true
        }
    })

    sharedState.register("selected_object_history", {
        skipCompare: true,
        skipValueOutput: true
    })

    sharedState.register("rule_editor_selected_rule_key", {
        persistence: {
            kind: 'url',
            key: 'rerk',
            base64: true
        }
    })

    sharedState.register("marker_editor_selected_marker_key", {
        persistence: {
            kind: 'url',
            key: 'remk',
            base64: true
        }
    })

    sharedState.register("is_side_menu_collapsed", {
        persistence: {
            kind: 'local-storage',
            key: 'is_side_menu_collapsed',
            serialize: (value) => value ? 'true' : 'false',
            deserialize: (value: string) => (value === 'true'),
        }
    })
}