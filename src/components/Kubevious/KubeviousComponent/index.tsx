import React from 'react';

import { ClassComponent } from '@kubevious/ui-framework';
import { GoldenLayout } from '@kubevious/ui-components';

import { layoutComponents, browserViewInfos } from './components';

export class KubeviousComponent extends ClassComponent<{}, {}> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.handleLayout = this.handleLayout.bind(this);
    }

    handleLayout(goldenLayout: GoldenLayout): void 
    {
        this.subscribeToSharedState(
            ["selected_dn", "auto_pan_to_selected_dn"],
            ({ selected_dn, auto_pan_to_selected_dn }) => {
                if (selected_dn) {
                    for(let viewInfo of browserViewInfos) {
                        if ((selected_dn as string).startsWith(viewInfo.root.dn)) {
                            goldenLayout.activateComponent(viewInfo.componentId!)
                        }
                    }
                }
            }
        )
    }

    componentDidMount() {
        this.setState({ state: this.state });
    }

    render() {
        return <GoldenLayout windows={layoutComponents} handleLayout={this.handleLayout} />;
    }
}
