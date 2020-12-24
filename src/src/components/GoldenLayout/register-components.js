import Diagram from '../Diagram';
import RuleEditor from '../Editors/RuleEditor';
import MarkerEditor from '../Editors/MarkerEditor';
import Properties from '../Properties';
import Alerts from '../Alerts';
import Timeline from '../Timeline';
import Summary from '../Summary';

class RegisterComponents {
    constructor(parent) {
        this._parent = parent

        this.setupComponents()
    }

    setupComponents() {
        this._parent._register({
            name: 'Summary',
            component: Summary,
            location: 'main',
            title: 'Summary',
            allowVerticalScroll: false
        })
        this._parent._register({
            name: 'Universe',
            component: Diagram,
            location: 'main',
            title: 'Universe',
            skipClose: true
        })
        this._parent._register({
            name: 'Rule Editor',
            component: RuleEditor,
            location: 'main',
            title: 'Rule Editor'
        })
        this._parent._register({
            name: 'Marker Editor',
            component: MarkerEditor,
            location: 'main',
            title: 'Marker Editor'
        })
        this._parent._register({
            name: 'Properties',
            component: Properties,
            location: 'right',
            title: 'Properties',
            width: 25,
            allowVerticalScroll: true
        })
        this._parent._register({
            name: 'Alerts',
            component: Alerts,
            location: 'bottom',
            title: 'Alerts',
            allowVerticalScroll: true
        })
        this._parent._register({
            name: 'Timeline',
            component: Timeline,
            location: 'bottom',
            title: 'Timeline',
            allowVerticalScroll: false
        })
    }
}

export default RegisterComponents
