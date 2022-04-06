import React, { FC, useState } from 'react';
// import $ from "jquery"
import _ from "the-lodash"
import cx from "classnames"

import "./styles.scss"

import { UserAnswer, WorldviousFeedbackQuestionKind  } from "../types"
import { WorldviousFeedbackQuestion } from '@kubevious/ui-middleware/dist/services/worldvious'


export interface QuestionProps
{
    question : WorldviousFeedbackQuestion;
    missingAnswers : Record<string, boolean>;

    updateAnswer : (answer: UserAnswer) => void;
}

export const Question : FC<QuestionProps> = ({ question, missingAnswers, updateAnswer }) => {



    const handleInputChange = (e : any) => {

        const value = e.target.value;
        let hasValue = false
        if (_.isNotNullOrUndefined(value) && value.length > 0) {
            hasValue = true
        }

        updateAnswer({
            id: e.target.name,
            value: value,
            hasValue: hasValue,
        });
        
    }

    const handleSubmit = () => {

    }

    const handleMultiselect = () => {

    }

    const setClicked = () => {

    }

    switch (question.kind)
    {
        case WorldviousFeedbackQuestionKind.input:
            return (
                <div className="user-input">
                    <label
                        className={cx(
                            "input-question",
                            { "non-optional": !question.optional },
                            {
                                "missing-answer":
                                    missingAnswers[question.id],
                            }
                        )}
                    >
                        {question.text}
                    </label>
                    <textarea
                        placeholder="Type here..."
                        name={question.id}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
            );

        case WorldviousFeedbackQuestionKind.rate:
            return (
                <div className="user-rate">
                    <label
                        className={cx(
                            "rate-question",
                            { "non-optional": !question.optional },
                            {
                                "missing-answer":
                                    missingAnswers[question.id],
                            }
                        )}
                    >
                        {question.text}
                    </label>
                    <div
                        role="group"
                        className="rate-stars"
                        onChange={handleInputChange}
                    >
                        {[5, 4, 3, 2, 1].map((val) => (
                            <input
                                type="radio"
                                id={`star${val}`}
                                key={val}
                                name={question.id}
                                value={val}
                            />
                        ))}
                    </div>
                </div>
            );

        case WorldviousFeedbackQuestionKind.single_select:
            return (
                <div className="user-single-select">
                    <label
                        className={cx(
                            "select-question",
                            { "non-optional": !question.optional },
                            {
                                "missing-answer":
                                    missingAnswers[question.id],
                            }
                        )}
                    >
                        {question.text}
                    </label>
                    <div role="group" className="select-buttons">
                        {question.options &&
                            question.options.map((option, index) => {
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        name={question.id}
                                        className={question.id}
                                        onClick={handleInputChange}
                                        onFocus={setClicked}
                                        value={option}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                    </div>
                </div>
            )

        case WorldviousFeedbackQuestionKind.multi_select:
            return (
                <div className="user-select">
                    <label
                        className={cx(
                            "select-question",
                            { "non-optional": !question.optional },
                            {
                                "missing-answer":
                                    missingAnswers[question.id],
                            }
                        )}
                    >
                        {question.text}
                    </label>
                    <div role="group" className="select-buttons">
                        {question.options &&
                            question.options.map((option, index) => {
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        name={question.id}
                                        onClick={handleMultiselect}
                                        value={option}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                    </div>
                </div>
            );

        default:
            return <>
            </>
    }
}
