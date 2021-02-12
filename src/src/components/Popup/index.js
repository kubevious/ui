import React from 'react'
import { BaseComponent } from '@kubevious/ui-framework'

import './styles.scss'


export class Popup extends BaseComponent {
    constructor(props) {
        super(props)
  
        this.closePopup = this.closePopup.bind(this);
    }

    closePopup() {
        this.sharedState.set('popup_window', null);
    }
  
    render() {
        return (
            <div id="popup" className="popup">
                <div className="popup-contents">
                    {this.props.popupContent}
                </div>
                <button className="close" onClick={this.closePopup}/>
            </div>
        )
    }
}
