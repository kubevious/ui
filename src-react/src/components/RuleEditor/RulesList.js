import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faUndo } from '@fortawesome/free-solid-svg-icons'
import { isEmptyArray } from '../../utils/util'
import cx from 'classnames'

const RulesList = ({ rules, selectedRule, selectRule, createNewRule, setVisibleOptions, service }) => {

    const exportRules = () => {
        service.backendExportRules(response => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response))
            const exportElem = document.getElementById('exportAnchor')
            exportElem.setAttribute('href', dataStr)
            exportElem.setAttribute('download', 'rules.json')
            exportElem.click()
        })
    }

    function ruleIndicatorClass(x)
    {
        var indicatorClass = '';
        if (!x.enabled) {
            indicatorClass = 'disabled';
        }
        else if (x.error_count)
        {
            indicatorClass = 'invalid';
        } else {
            indicatorClass = 'enabled';
        }
        return indicatorClass;
    }


    return (
        <div id="rule-list">
            <div className="rule-header">
                <div className="btn-group">
                    <button className="button success new-rule-btn" onClick={() => createNewRule()}>
                        <div className="plus">+</div>
                        New rule
                    </button>
                    <button className="button square light export" onClick={exportRules}>
                        <FontAwesomeIcon icon={faDownload}/>
                    </button>
                    <a id='exportAnchor' style={{ display: 'none' }}/>
                    <button className="button square light"
                            onClick={() => setVisibleOptions(true)}>
                        <FontAwesomeIcon icon={faUndo}/>
                    </button>
                </div>
            </div>

            <div className="rules">
                {!isEmptyArray(rules) && rules.map(rule => (
                    <button key={rule.id}
                            className={cx('rule-item-button', { 'selected': rule.id === selectedRule.id })}
                            onClick={() => selectRule(rule)}>
                        {rule.name}
                        {!rule.isCurrent && 
                            <div class="busy-rule-indicator"></div>
                        }
                        <div
                            className={cx('indicator', ruleIndicatorClass(rule))}/>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default RulesList
