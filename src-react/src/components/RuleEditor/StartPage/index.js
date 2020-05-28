import React from 'react'

const StartPage = ({ createNewRule }) => {
    return (
        <div className="start-rule-container">
            <div className="start-wrapper">
                <div className="start-text">You have no rules defined. Time to create your new rule:</div>
                <div className="start-btn-wrapper">
                    <button className="button success new-rule-btn" onClick={() => createNewRule()}>
                        <div className="plus">+</div>
                        New rule
                    </button>
                </div>
                <div className="start-text">Learn more about Kubevious rule here</div>
            </div>
        </div>
    )
}

export default StartPage
