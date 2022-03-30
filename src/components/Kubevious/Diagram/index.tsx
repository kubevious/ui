import React from 'react';
import { ClassComponent } from '@kubevious/ui-framework';
import { DiagramProps, DiagramState } from './types';
import { DiagramBrowser, DiagramBrowserViewOptions } from '@kubevious/ui-browser';
import { MyGlobalState } from '../logic/global-state';

export class Diagram extends ClassComponent<DiagramProps, DiagramState> {
    constructor(props: DiagramProps | Readonly<DiagramProps>) {
        super(props);

        this.state = {
            rootDn: props.rootDn || 'root'
        };
    }

    componentDidMount() {
       
    }

    render() {

        const {rootDn} = this.state;

        const viewOptions : Partial<DiagramBrowserViewOptions> = {
            // useVerticalNodeView: false,
            // useVerticalNodeCount: 2,
            // useGridView: false
        }

        return (
            <DiagramBrowser 
                diagramSource={MyGlobalState.diagramSource!}
                rootDn={rootDn}
                viewOptions={viewOptions}
                >
            </DiagramBrowser>
        );
    }
}
