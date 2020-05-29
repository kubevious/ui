import React from 'react'

const StartPage = ({ type, createNewItem }) => {
    return (
        <div className="start-rule-container">
            <div className="start-wrapper">
                <div className="start-text">You have no {type}s defined. Time to create your new {type}:</div>
                <div className="start-btn-wrapper">
                    <button className="button success new-rule-btn" onClick={() => createNewItem()}>
                        <div className="plus">+</div>
                        New {type}
                    </button>
                </div>
                <div className="start-text">Learn more about Kubevious {type} here</div>
            </div>
        </div>
    )
}

export default StartPage
