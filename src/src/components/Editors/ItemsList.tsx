import React from 'react'
import { isEmptyArray } from '../../utils/util'
import cx from 'classnames'
import MarkerPreview from '../MarkerPreview'
import BurgerMenu from '../BurgerMenu';
import { Type } from './types';

const ItemsList = ({ type, items, selectedItemId, selectItem, createNewItem, service }) => {

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

                    <BurgerMenu type={type} service={service}/>
                </div>
            </div>

            <div className={cx('rules', { 'markers': type === Type.marker })}>
                {!isEmptyArray(items) && items.map(item => (
                    <button key={item.name}
                            className={cx('rule-item-button', { 'selected': item.name === selectedItemId })}
                            onClick={() => selectItem(item)}
                    >
                        <div className="item">
                            {type === Type.marker && <div className="shape-wrapper">
                                <MarkerPreview shape={item.shape} color={item.color} />
                            </div>}

                            <div className="indicators">
                                {type === Type.rule && <div className={cx('indicator', ruleIndicatorClass(item))} />}
                                {type === Type.rule && !item.is_current && <div className="busy-rule-indicator" />}
                            </div>

                            {item.name}
                        </div>
                        {item.item_count > 0 && `[${item.item_count}]`}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ItemsList
