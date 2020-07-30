import React from 'react'
import './styles.scss'
import GoldenLayoutComponent from '../GoldenLayout'
import Popup from '../Popup'
import Header from '../Header'
import BaseComponent from '../../HOC/BaseComponent'
import SEO from '../SEO'
import FieldsSaver from '../../utils/save-fields'
import ErrorBox from '../ErrorBox';

class Root extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            showPopup: false,
            popupContent: null,
            layout: null,
            windows: [],
            isError: false,
            error: null
        }

        this._fieldsSaver = new FieldsSaver('Diagram')

        this.handleShowPopup = this.handleShowPopup.bind(this)
        this.handleClosePopup = this.handleClosePopup.bind(this)
        this.handlePopupContent = this.handlePopupContent.bind(this)
        this.handleLayout = this.handleLayout.bind(this)
        this.handleChangeWindow = this.handleChangeWindow.bind(this)
        this.closeError = this.closeError.bind(this)

        this.subscribeToSharedState([
            'time_machine_enabled', 'time_machine_date', 'selected_dn',
            'time_machine_date_to', 'time_machine_duration', 'time_machine_date_from'
        ],
            ({
                time_machine_enabled, time_machine_date, selected_dn, time_machine_date_to, time_machine_date_from,
                time_machine_target_date = this.sharedState.get('time_machine_target_date'), time_machine_duration,
            }) => {

                this._fieldsSaver.setValue({
                    time_machine_enabled, time_machine_date, selected_dn, time_machine_date_to, 
                    time_machine_target_date, time_machine_duration, time_machine_date_from
                })
            })
    }

    handleShowPopup() {
        this.setState({ showPopup: true })
    }

    handleClosePopup() {
        this.setState({ showPopup: false })
    }

    handlePopupContent(content) {
        this.setState({ popupContent: content })
    }

    handleLayout(value) {
        this.setState({
            layout: value, windows: value._components
                .filter(item => !item.skipClose)
                .map(component => ({ ...component, isVisible: true }))
        })

        this.subscribeToSharedState(['selected_dn', 'auto_pan_to_selected_dn'], 
            ({selected_dn, auto_pan_to_selected_dn}) => {
                if (selected_dn) {
                    value.activateComponent('universeComponent')
                }
            }
        );

        this.subscribeToSharedState('rule_editor_selected_rule_id', (rule_editor_selected_rule_id) => {
            if (rule_editor_selected_rule_id) {
                value.activateComponent('ruleEditorComponent')
            }
        })
    }

    closeError() {
        this.sharedState.set('is_error', false)
        this.sharedState.set('error', null)
    }

    handleChangeWindow(e) {
        const { windows, layout } = this.state

        const windowId = e.target.getAttribute('tool-window-id');
        const isVisible = document.getElementById(windowId) !== null;

        this.setState({
            windows: windows.map(component => component.id === windowId ? {
                ...component,
                isVisible: isVisible
            } : component)
        })

        if (isVisible) {
            layout.hideComponent(windowId);
        } else {
            layout.showComponent(windowId);
        }
    }

    componentDidMount() {
        this.subscribeToSharedState(['is_error', 'error'], ({ is_error, error }) => {
            this.setState({ error: error, isError: is_error})
        })
    }

    render() {
        const { showPopup, popupContent, windows, isError, error } = this.state

        return (
            <>
                <SEO />
                <div className="mobile-wrapper">
                    <div className="logo" />
                    <div className="available-msg">
                        Sorry!<br /><br />
                        Kubevious works with Desktop browsers only.<br /><br />
                        <a href="https://kubevious.io/youtube.html" className="link-cta">See Demo in Youtube</a>
                    </div>
                </div>
                <div className="wrapper">
                    <Header
                        handleShowPopup={this.handleShowPopup}
                        handlePopupContent={this.handlePopupContent}
                        handleClosePopup={this.handleClosePopup}
                        handleChangeWindow={this.handleChangeWindow}
                        windows={windows}
                    />

                    <GoldenLayoutComponent
                        diagramSource={this.diagramSource}
                        handleLayout={this.handleLayout}
                        handleShowPopup={this.handleShowPopup}
                        handlePopupContent={this.handlePopupContent}
                        closePopup={this.handleClosePopup}
                    />

                    {showPopup && <Popup closePopup={this.handleClosePopup}>
                        {popupContent}
                    </Popup>}

                    {isError && <ErrorBox error={error} closeError={this.closeError}/>}
                </div>
            </>
        )
    }
}

export default Root
