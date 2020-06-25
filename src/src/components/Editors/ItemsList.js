import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faUndo } from '@fortawesome/free-solid-svg-icons'
import { isEmptyArray } from '../../utils/util'
import cx from 'classnames'
import MarkerPreview from '../MarkerPreview'

const ItemsList = ({ type, items, selectedItemId, selectedItem, selectItem, createNewItem, setVisibleOptions, service }) => {
    const exportItems = () => {
        service.backendExportItems(response => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response))
            const exportElem = document.getElementById('exportAnchor')
            exportElem.setAttribute('href', dataStr)
            exportElem.setAttribute('download', `${type}s.json`)
            exportElem.click()
        })
    }

    const ruleIndicatorClass = (x) => {
        let indicatorClass
        if (!x.enabled) {
            indicatorClass = 'disabled'
        } else if (x.error_count) {
            indicatorClass = 'invalid'
        } else {
            indicatorClass = 'enabled'
        }
        return indicatorClass
    }

    return (
        <div id="rule-list">
            <div className="rule-header">
                <div className="btn-group">
                    <button className="button success new-rule-btn" onClick={() => createNewItem()}>
                        <div className="plus">+</div>
                        <span className="button-text">New {type}</span>
                    </button>
                    <button className="button square light export" onClick={exportItems}>
                        <FontAwesomeIcon icon={faDownload}/>
                    </button>
                    <a id='exportAnchor' style={{ display: 'none' }}/>
                    <button className="button square light"
                            onClick={() => setVisibleOptions(true)}>
                        <FontAwesomeIcon icon={faUndo}/>
                    </button>
                </div>
            </div>

            <div className={cx('rules', { 'markers': type === 'marker' })}>
                {!isEmptyArray(items) && items.map(item => (
                    <button key={item.name}
                            className={cx('rule-item-button', { 'selected': item.name === selectedItemId })}
                            onClick={() => selectItem(item)}>
                        {type === 'marker' && <div className="shape-wrapper">
                            <MarkerPreview shape={item.shape} color={item.color}/>
                        </div>}
                        {item.name}
                        <div className="indicators">
                            {type === 'rule' && !item.is_current && <div className="busy-rule-indicator" />}
                            {type === 'rule' && <div className={cx('indicator', ruleIndicatorClass(item))} />}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ItemsList
