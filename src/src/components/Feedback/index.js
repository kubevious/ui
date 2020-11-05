import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import $ from 'jquery'
import './styles.scss'


class Feedback extends BaseComponent {
    constructor(props) {
        super(props)

        this.registerService({ kind: 'misc' })

        this.state = {
            screen: 'questions',
            userAnswers: { id: props.request.id, answers: [] },
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleMultiselect = this.handleMultiselect.bind(this)
        this.setClicked = this.setClicked.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit() {
        const userAnswers = this.state.userAnswers

        this.service.submitFeedback(userAnswers, () => {
            this.setState({ screen: 'share' })
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
                            <input
                                type="radio"
                                id="star1"
                                name={question.id}
                                value="5/5"
                            />
                            <input
                                type="radio"
                                id="star2"
                                name={question.id}
                                value="4/5"
                            />
                            <input
                                type="radio"
                                id="star3"
                                name={question.id}
                                value="3/5"
                            />
                            <input
                                type="radio"
                                id="star4"
                                name={question.id}
                                value="2/5"
                            />
                            <input
                                type="radio"
                                id="star5"
                                name={question.id}
                                value="1/5"
                            />
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

    composeTweet() {
        const message =
            'I am a proud @kubevious user and it helps making #Kubernetes easier to use and #DevOps more fun. Now I am an #SRE with extraordinary abilities!\n\nTry it yourself: https://kubevious.io'
        const text = encodeURIComponent(message)
        const url = `https://twitter.com/intent/tweet?text=${text}`

        return url
    }

    composeFBpost() {
        const message =
            'I am a proud @kubevious user and it helps making #Kubernetes easier to use and #DevOps more fun. Now I am an #SRE with extraordinary abilities!\n\nTry it yourself: https://kubevious.io'
        const text = encodeURIComponent(message)
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://kubevious.io')}&quote=${text}`
        return url
    }

    composeLinkedInpost() {
        const url = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent('https://kubevious.io')}`
        return url
    }

    switchScreens() {
        switch (this.state.screen) {
            case 'questions':
                return true
            case 'share':
                return false
        }
    }

    renderScreens() {
        if (this.switchScreens()) {
            const { questions } = this.props.request
            return (
                <>
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
                </>
            )
        }
        $('.new-version-inner').detach()
        return (
            <div className="completed-screen">
                <div className="submit-thank">Thank you for your feedback!</div>
                <div className="submit-share">
                    You can also tell your friends how you liked Kubevious:
                </div>
                <div className="share-buttons">
                    <a
                        type="button"
                        className="btn-twitter"
                        href={this.composeTweet()}
                        target="_blank"
                    >
                        Tweet it
                        <img src="./img/social/twitter.svg"></img>
                    </a>
                    <a
                        type="button"
                        className="btn-fb"
                        href={this.composeFBpost()}
                        target="_blank"
                    >
                        Share on Facebook
                        <img src="./img/social/facebook.svg"></img>
                    </a>
                    <a
                        type="button"
                        className="btn-linkedin"
                        href={this.composeLinkedInpost()}
                        target="_blank"
                    >
                        Post on LinkedIn
                        <img src="./img/social/linkedin.svg"></img>
                    </a>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="separate-container">
                {this.renderScreens()}
            </div>
        )
    }
}

export default Feedback
