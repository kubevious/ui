import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import Snooze from '../Snooze'
import PostFeedback from '../PostFeedback'
import $ from 'jquery'
import './styles.scss'


class Feedback extends BaseComponent {
    constructor(props) {
        super(props)

        this.registerService({ kind: 'misc' })

        this.state = {
            userAnswers: { answers: [] },
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleMultiselect = this.handleMultiselect.bind(this)
        this.setClicked = this.setClicked.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit() {
        
        const data = {
            id: this.props.request.id,
            kind: this.props.request.kind,
            answers: this.state.userAnswers.answers
        }

        this.service.submitFeedback(data, () => {
            this.sharedState.set('popup_window', {
                title: 'Post Feedback',
                content: <PostFeedback />
            })
        })
    }

    handleInputChange(e) {
        const answer = { id: e.target.name, value: e.target.value }
        const changedAnswers = this.state.userAnswers.answers
        const found = changedAnswers.find((item) => item.id === answer.id)

        found
            ? changedAnswers.map((item) => {
                  if (item.id == answer.id) {
                      item.value = answer.value
                  }
              })
            : changedAnswers.push(answer)

        this.setState({ ...this.state.userAnswers, answers: changedAnswers })
    }

    setClicked(e) {
        $('.user-single-select button').removeClass('clicked')
        e.target.classList.add('clicked')
    }

    handleMultiselect(e) {
        e.target.classList.toggle('clicked')

        const changedAnswers = this.state.userAnswers.answers
        const answer = { id: e.target.name, value: [e.target.value] }
        const found = changedAnswers.find((item) => item.id === answer.id)

        if (!found) {
            changedAnswers.push(answer)
        } else {
            const element = found.value.find((item) => item === e.target.value)
            found.value = element
                ? found.value.filter((item) => item !== e.target.value)
                : found.value.concat(e.target.value)
        }

        this.setState({ ...this.state.userAnswers, answers: changedAnswers })
    }

    renderQuestion (question, index) {
        switch (question.kind) {
            case 'input':
                return (
                    <div className="user-input" id={index}>
                        <label className="input-question">
                            {question.text}
                        </label>
                        <textarea
                            type="text"
                            placeholder="Type here..."
                            name={question.id}
                            onChange={this.handleInputChange}
                        ></textarea>
                    </div>
                )
            case 'rate':
                return (
                    <div className="user-rate" id={index}>
                        <label className="rate-question">{question.text}</label>
                        <div
                            role="group"
                            className="rate-stars"
                            onChange={this.handleInputChange}
                        >
                            {[5, 4, 3, 2, 1].map(val => (
                                <input
                                    type="radio"
                                    id="star1"
                                    name={question.id}
                                    value={val}
                            />
                            ))}
                        </div>
                    </div>
                )
            case 'single-select':
                return (
                    <div className="user-single-select" id={index}>
                        <label className="select-question">
                            {question.text}
                        </label>
                        <div role="group" className="select-buttons">
                            {question.options.map((option) => {
                                return (
                                    <button
                                        type="button"
                                        name={question.id}
                                        onClick={this.handleInputChange}
                                        onFocus={this.setClicked}
                                        value={option}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
            case 'multi-select':
                return (
                    <div className="user-select" id={index}>
                        <label className="select-question">
                            {question.text}
                        </label>
                        <div role="group" multiple className="select-buttons">
                            {question.options.map((option) => {
                                return (
                                    <button
                                        type="button"
                                        name={question.id}
                                        onClick={this.handleMultiselect}
                                        value={option}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
        }
    }

    render() {
        const { questions } = this.props.request

        return (
            <div className="separate-container">
                <div className="feedback-header">
                    <h3 className="heading-text">Give us your feedback</h3>
                </div>
                <div className="feedback-info">
                    {questions.map((question, index) =>
                        this.renderQuestion(question, index)
                    )}
                    <button
                        className="feedback-submit button success"
                        onClick={this.handleSubmit}
                        type="submit"
                    >
                        Submit Feedback
                    </button>
                </div>
                <Snooze id={this.props.request.id} kind={this.props.request.kind} />
            </div>
        )
    }
}

export default Feedback
