import React  from 'react'
import { isEmptyArray } from '../../utils/util'
import DnShortcutComponent from '../DnShortcutComponent'

import './styles.scss'
import BaseComponent from '../BaseComponent'

class Search extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            result: []
        }
    }

    handleChange(e) {
        this.setState({ value: e.target.value })
        this.service.fetchSearchResults(e.target.value, result => {
            this.setState({ result: result })
        })
    }

    render() {
        const { value, result } = this.state

        return (
            <>
                <div className="form-group has-success">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search"
                        value={value}
                        onChange={(e) => this.handleChange(e)}
                    />
                </div>
                <div className="search-results">
                    {!isEmptyArray(result) && result.map((item, index) => (
                        <DnShortcutComponent key={index} dn={item.dn} sharedState={this.sharedState} hidePopup={this.props.closePopup}/>
                    ))}
                </div>
            </>
        )
    }
}

export default Search
