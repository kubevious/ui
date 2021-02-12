import React, { useEffect, useState } from "react"
import { isEmptyArray, isEmptyObject } from "../../utils/util"
import cx from "classnames"
import AffectedObjects from "./AffectedObjects"
import StartPage from "./StartPage"
import RuleMainTab from "./RuleMainTab"
import MarkerMainTab from "./MarkerMainTab"
import { SelectedItem, SelectedItemData, Type } from "./types"
import { SelectedData } from "../../types"

type EditorProps = {
    type: string
    items: SelectedData[]
    isNewItem: boolean
    selectedItem: SelectedItem
    selectedItemData: SelectedItemData
    selectedItemId: string
    createNewItem: () => void
    saveItem: () => void
    deleteItem: () => void
    createItem: () => void
    openSummary: () => void
    isSuccess: boolean
}

export const Editor: React.FunctionComponent<EditorProps> = ({
    type,
    items,
    isNewItem,
    selectedItem,
    selectedItemData,
    selectedItemId,
    createNewItem,
    saveItem,
    deleteItem,
    createItem,
    openSummary,
    isSuccess,
}) => {
    const [selectedTab, setSelectedTab] = useState<string>("main")

    let itemCount = 0
    if (selectedItemData.items) {
        itemCount = selectedItemData.items.length
    } else {
        itemCount = selectedItemData.item_count
    }

    if (type === Type.marker) {
        if (selectedItemData.items) {
            for (var item of selectedItemData.items) {
                item.markers = [selectedItem.name]
            }
        }
    }

    useEffect(() => {
        setSelectedTab("main")
    }, [selectedItemId])

    const detectEditor = (): JSX.Element => {
        return (
            <>
                {type === Type.rule ? (
                    <RuleMainTab
                        selectedItemId={selectedItemId}
                        selectedItem={selectedItem}
                        selectedItemData={selectedItemData}
                        deleteItem={deleteItem}
                        openSummary={openSummary}
                        saveItem={saveItem}
                        createItem={createItem}
                        isSuccess={isSuccess}
                    />
                ) : (
                    <MarkerMainTab
                    
                        // selectedItemId={selectedItemId} // TODO: Semyon to check
                        selectedItem={selectedItem}
                        // selectedItemData={selectedItemData} // TODO: Semyon to check
                        deleteItem={deleteItem}
                        openSummary={openSummary}
                        saveItem={saveItem}
                        createItem={createItem}
                        isSuccess={isSuccess}
                    />
                )}
            </>
        )
    }

    const renderLoading = (): false | JSX.Element => {
        return (
            !isNewItem &&
            selectedItemData.status &&
            type === Type.rule &&
            !selectedItemData.status.is_current && (
                <div className="busy-rule-indicator" />
            )
        )
    }

    const renderEditor = (): JSX.Element => {
        return (
            <>
                <div className="editor-title">
                    {renderLoading()}
                    {isNewItem && (
                        <div className="editor-title">Create new {type}</div>
                    )}
                    {!isNewItem && (
                        <>
                            <div
                                className={cx("tab rule-tab", {
                                    selected: selectedTab === "main",
                                })}
                                onClick={() => setSelectedTab("main")}
                            >
                                Edit {type}
                            </div>
                            <div
                                className={cx("tab object-tab", {
                                    selected: selectedTab === "object",
                                })}
                                onClick={() => setSelectedTab("object")}
                            >
                                Affected objects[{itemCount}]
                            </div>
                        </>
                    )}
                </div>

                {selectedTab === "main" && detectEditor()}

                {selectedTab === "object" &&
                    !isEmptyArray(selectedItemData.items) && (
                        <AffectedObjects selectedItemData={selectedItemData} />
                    )}
            </>
        )
    }

    return (
        <div id="rule-editor">
            <div className="rule-container">
                {isEmptyObject(items) && isEmptyObject(selectedItem) && (
                    <StartPage type={type} createNewItem={createNewItem} />
                )}

                {!isEmptyObject(selectedItem) && renderEditor()}

                {!isEmptyObject(items) && isEmptyObject(selectedItem) && (
                    <StartPage type={type} createNewItem={createNewItem} />
                )}
            </div>
        </div>
    )
}

export default Editor
