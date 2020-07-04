import React from 'react'

const StartPage = ({ type, createNewItem }) => {
    return (
        <div className="start-rule-container">
            <div className="start-wrapper">
                <div className="start-btn-wrapper">
                    <button className="button success new-rule-btn" onClick={() => createNewItem()}>
                        <div className="plus">+</div>
                        New {type}
                    </button>
                </div>

                <div className="or-container">
                    <div className="line top"/>
                    <div className="circle">or</div>
                    <div className="line bottom"/>
                </div>

                <div className="links-container">
                    <a href="https://github.com/kubevious/kubevious/blob/master/docs/rules-engine.md#rules-engine" target="_blank"
                       className="start-text">Learn more about rules engine</a>
                    <a href="https://github.com/kubevious/rules-library#kubevious-rules-library" target="_blank" className="start-text">Browse rules library</a>
                    <a href="https://kubevious.io/slack/" target="_blank" className="start-text">Get help in slack channel</a>
                </div>
            </div>
        </div>
    )
}

export default StartPage
