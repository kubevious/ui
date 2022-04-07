import React, { FC, useState } from 'react';
import _ from "the-lodash"
import cx from "classnames"

import { Label, Textarea } from '@kubevious/ui-components';
import styles from './styles.module.css';

import { UserAnswer  } from "../types"
import { WorldviousFeedbackQuestion,
         WorldviousFeedbackQuestionKind
        } from '@kubevious/ui-middleware/dist/services/worldvious'

export interface QuestionProps
{
    question : WorldviousFeedbackQuestion;
    answer? : UserAnswer;
    isMissingAnswer: boolean;

    updateAnswer : (value: string[]) => void;
}

export const Question : FC<QuestionProps> = ({ question, answer, isMissingAnswer, updateAnswer }) => {

    const currentValues = answer?.value ?? [];
    const currentValue = _.first(currentValues) ?? null;

    const handleInputChange = (value : string) => {

        if (_.isNotNullOrUndefined(value) && value.length > 0) {
            updateAnswer([value]);
        } else {
            updateAnswer([]);
        }

    }

    const handleMultiselect = (option : string) => {

        const optionsDict = _.makeDict(answer?.value ?? [], x => x, x => true);

        if (optionsDict[option])
        {
            delete optionsDict[option];
        } else {
            optionsDict[option] = true;
        }

        updateAnswer(_.keys(optionsDict));
    }

    const setClicked = () => {

    }

    const renderQuestion = () => {
        switch (question.kind)
        {
            case WorldviousFeedbackQuestionKind.input:
                return (<div>

                    <Textarea 
                              onChange={(e) => handleInputChange(e.target.value)} />
                    
                </div>);

            case WorldviousFeedbackQuestionKind.rate:
                return (
                    
                    <div
                        role="group"
                        className={styles.rateStars}
                        onChange={(e : any) => handleInputChange(e?.target?.value ?? null)}
                    >
                        {[5, 4, 3, 2, 1].map((val) => (
                            <input key={val}
                                type="radio"
                                id={`star${val}`}
                                name={question.id}
                                value={val}
                            />
                        ))}
                    </div>
                );

            case WorldviousFeedbackQuestionKind.single_select:
                return <div className={styles.buttonsContainer}>
                    {question.options &&
                        question.options.map((option, index) => {
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    name={question.id}
                                    className={cx(styles.selectButton, {[styles.selectButtonSelected]: currentValues.includes(option) })}
                                    onClick={(e) => handleInputChange(option)}
                                    onFocus={setClicked}
                                    value={option}
                                >
                                    {option}
                                </button>
                            )
                        })}
                </div>

            case WorldviousFeedbackQuestionKind.multi_select:
                return <div className={styles.buttonsContainer}>
                    {question.options &&
                        question.options.map((option, index) => {
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    name={question.id}
                                    className={cx(styles.selectButton, {[styles.selectButtonSelected]: currentValues.includes(option) })}
                                    onClick={(e) => handleMultiselect(option)}
                                    value={option}
                                >
                                    {option}
                                </button>
                            )
                        })}
                </div>;

            default:
                return <>
                </>
        }
    }

    return <div className={styles.questionContainer}>

        <div className={styles.title}>
            <Label text={question.text}
                   className={cx({
                       [styles.nonOptionalLabel]: !question.optional,
                       [styles.missingValueLabel]: isMissingAnswer,
                    })} 
            
            />
        </div>

        {renderQuestion()}
    </div>
}
