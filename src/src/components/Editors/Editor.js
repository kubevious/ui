import React, { useEffect, useState } from 'react'
import { isEmptyArray, isEmptyObject } from '../../utils/util'
import cx from 'classnames'
import AffectedObjects from './AffectedObjects'
import StartPage from './StartPage'
import RuleMainTab from './RuleMainTab'
import MarkerMainTab from './MarkerMainTab'

const Editor = ({ type, items, isNewItem, selectedItem, selectedItemData, selectedItemId, createNewItem, saveItem, deleteItem, createItem, openSummary, isSuccess }) => {
    const [selectedTab, setSelectedTab] = useState('main')


    var itemCount = 0;
    if (selectedItemData.items) {
        itemCount = selectedItemData.items.length;
    } else {
        itemCount = selectedItemData.item_count;
    }
    
    useEffect(() => {
        setSelectedTab('main')
    }, [selectedItemId])

    const detectEditor = () => {
        return (
            <>
                {type === 'rule' ?
                    <RuleMainTab
                        selectedItemId={selectedItemId}
                        selectedItem={selectedItem}
                        selectedItemData={selectedItemData}
                        deleteItem={deleteItem}
                        openSummary={openSummary}
                        saveItem={saveItem}
                        createItem={createItem}
                        isSuccess={isSuccess}/> :
                    <MarkerMainTab
                        selectedItemId={selectedItemId}
                        selectedItem={selectedItem}
                        selectedItemData={selectedItemData}
                        deleteItem={deleteItem}
                        openSummary={openSummary}
                        saveItem={saveItem}
                        createItem={createItem}
                        isSuccess={isSuccess}/>}
            </>
        )
    }

    const renderLoading = () => {
        return (
            !isNewItem &&
            (selectedItemData.status && !selectedItemData.status.is_current) &&
            type === 'rule' &&
            <div className="busy-rule-indicator"/>
        )
    }

    const renderEditor = () => {
        return (
            <>
                <div className="editor-title">
                    {renderLoading()}

                    {isNewItem && <div className='editor-title'>Create new {type}</div>}

                    {!isNewItem && <>
                        <div className={cx('tab rule-tab', { 'selected': selectedTab === 'main' })}
                             onClick={() => setSelectedTab('main')}>Edit {type}
                        </div>
                        <div
                            className={cx('tab object-tab', { 'selected': selectedTab === 'object' })}
                            onClick={() => setSelectedTab('object')}
                        >
                            Affected objects <div className="object-error-count">{itemCount}</div>
                        </div>
                    </>}

                </div>

                {selectedTab === 'main' && detectEditor()}

                {selectedTab === 'object' && !isEmptyArray(selectedItemData.items) &&
                <AffectedObjects selectedItemData={selectedItemData} />}
            </>
        )
    }

    return (
        <div id="rule-editor">
            <div className="rule-container">
                {isEmptyObject(items) && isEmptyObject(selectedItem) && <StartPage type={type} createNewItem={createNewItem}/>}

                {!isEmptyObject(selectedItem) && renderEditor()}

                {!isEmptyObject(items) && isEmptyObject(selectedItem) &&
                <div className="no-rule">No selected {type}</div>}
            </div>
        </div>
    )
}

export default Editor
