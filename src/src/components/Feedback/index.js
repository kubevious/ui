import React, { useState } from 'react'
import './styles.scss'

const Feedback = ({ questions }) => {
    const formData = {}
    const [screen, setScreen] = useState('questions')

    const setInput = (e, text) => {
        formData[text] =  e.target.value
    }

    const setRadio = (e, text) => {
        formData[text] = e.target.value
    }

    const setButton = (e, text) => {
        formData[text] = e.target.value
    }

    const renderQuestion = (question, index) => {
        switch (question.type) {
            case 'input': return (
                <div className="user-input" id={index} >
                    <label className="input-question">{question.text}</label>
                    <textarea type="text" placeholder="Type here..." onChange={(e) => setInput(e, question.text)}></textarea>
                </div>
            )
            case 'rate': return (
                <div className="user-rate" id={index}>
                    <label className="rate-question">{question.text}</label>
                    <div role="group" className="rate-stars" onChange={e => setRadio(e, question.text)}>
                        <input type="radio" id="star1" name="rate" value="1" />
                        <input type="radio" id="star2" name="rate" value="2" />
                        <input type="radio" id="star3" name="rate" value="3" />
                        <input type="radio" id="star4" name="rate" value="4" />
                        <input type="radio" id="star5" name="rate" value="5" />
                    </div>
                </div>
            )
            case 'select': return (
                <div className="user-select" id={index}>
                    <label className="select-question">{question.text}</label>
                    <div role="group" className="select-buttons">
                        {question.options.map(option => {
                            return <button type="button" onClick={e => setButton(e, question.text)} value={option}>{option}</button>
                        })}
                    </div>
                </div>
            )
        }
    }

    const onSubmit = () => {
        console.log('[DATA FILLED BY USER::]', formData)
        setScreen('share')
    }

    const swithScreens = () => {
        switch (screen) {
            case 'questions': return true
            case 'share': return false
        }
    }

    const renderScreens = () => {
        if (swithScreens()) {
            return <>{questions.map((question, index) => {
                return renderQuestion(question, index)
              })}
                    <button className="feedback-submit button success" onClick={onSubmit} type="submit">
                Submit Feedback
              </button></>
        }
        return <>
            <div className="submit-thank">Thank you for your feedback!</div>
            <div className="submit-share">You can also share your feedback on:</div>
            <div className="share-buttons">
                <a type="button" className="btn-twitter" href="/">Twitter</a>
                <a type="button" className="btn-fb" href="/">Facebook</a>
                <a type="button" className="btn-linkein" href="/">LinkedIn</a>
            </div>
        </>
    }

    return (
      <div className="p-40 feedback-popup">
        <div>
          <h3 className="heading-text">Give us your feedback</h3>
        </div>
        <div className="feedback-info overflow-hide">
            {renderScreens()}
        </div>
      </div>
    )
}


export default Feedback
