import React  from 'react'
import './styles.scss'
import GoldenLayoutComponent from '../GoldenLayout'
import Popup from '../Popup'
import Header from '../Header'
import BaseComponent from '../../HOC/BaseComponent'
import SEO from '../SEO'

class Root extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            showPopup: false,
            popupContent: null,
            layout: null,
            windows: []
        }

        this.handleShowPopup = this.handleShowPopup.bind(this)
        this.handleClosePopup = this.handleClosePopup.bind(this)
        this.handlePopupContent = this.handlePopupContent.bind(this)
        this.handleLayout = this.handleLayout.bind(this)
        this.handleChangeWindow = this.handleChangeWindow.bind(this)
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

        this.subscribeToSharedState('selected_dn', (selected_dn) => {
            if (selected_dn) {
                value.activateComponent('universeComponent')
            }
        })
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

    render() {
        const { showPopup, popupContent, windows } = this.state

        return (
            <>
                <SEO />
                <div className="mobile-wrapper">
                    <div className="logo"/>
                    <div className="available-msg">
                        Sorry!<br/><br/>
                        Kubevious works with Desktop browsers only.<br/><br/>
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
                </div>
            </>
        )
    }
}

export default Root