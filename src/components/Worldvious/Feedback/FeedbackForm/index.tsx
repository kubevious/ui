import React, { FC, useState } from 'react';
import { useService } from "@kubevious/ui-framework"
import { Snooze } from "../../Snooze"
// import $ from "jquery"
import _ from "the-lodash"
import cx from "classnames"

import styles from './styles.module.css';

// import { IWorldviousService } from "@kubevious/ui-middleware"
import { UserAnswer } from "../types"
import { IWorldviousService, WorldviousAnswer, WorldviousFeedbackQuestion, WorldviousFeedbackRequest, WorldviousFeedbackSubmitData } from '@kubevious/ui-middleware/dist/services/worldvious'

import { Question } from '../Question';
import { Button } from '@kubevious/ui-components/dist';

export interface FeedbackFormProps
{
    item : WorldviousFeedbackRequest;
    onPostSubmit?: () => void;
}

export const FeedbackForm : FC<FeedbackFormProps> = ({ item, onPostSubmit }) => {

    const [ answers, setAnswers ] = useState<Record<string, UserAnswer>>({}); 
    const [ missingAnswers, setMissingAnswers ] = useState<Record<string, boolean>>({}); 
    
    const [ isSubmitAllowed, setIsSubmitAllowed ] = useState<boolean>(true); 

    const service = useService<IWorldviousService>({ kind: 'worldvious' });

    const checkAnswers = () => {
        const newMissingAnswers : Record<string, boolean> = {}
        let isQuestionsAnswered = true

        for(const question of item.questions)
        {
            if (!question.optional) {
                const answerInfo = answers[question.id]
                if (!answerInfo || !answerInfo.hasValue) {
                    newMissingAnswers[question.id] = true
                    isQuestionsAnswered = false
                }
            }
        }

        setIsSubmitAllowed(isQuestionsAnswered);
        setMissingAnswers(newMissingAnswers);

        return isQuestionsAnswered;
    }

    const handleSubmit = () => {
        if (checkAnswers()) {

            const dataAnswers : WorldviousAnswer[] = _.values(answers)
                .filter((x) => x.hasValue)
                .map((x) => {
                    const dataAnswer: WorldviousAnswer = {
                        id: x.id,
                        value: x.value,
                    }
                    return dataAnswer;
                })

            const data: WorldviousFeedbackSubmitData = {
                id: item.id,
                answers: dataAnswers,
            }

            console.log("XXXXX ", data);
            service!.submitFeedback(data)
                .then(() => {
                    console.log("!!!!!! ", data);
                    if (onPostSubmit) {
                        onPostSubmit();
                    }

                })

        }
    }

    const updateAnswer = (question: WorldviousFeedbackQuestion, value: string[]) => {
        const x = _.clone(answers);
        x[question.id] = {
            id: question.id,
            value: value,
            hasValue: value.length > 0
        };
        setAnswers(x);
    }

    return (
        <>

            {item.questions &&
                item.questions.map((question, index) => (
                    <div className={styles.feedbackQuestionContainer}
                            key={index}>
                        <Question question={question}
                                    answer={answers[question.id]}
                                    isMissingAnswer={missingAnswers[question.id] ?? false}
                                    updateAnswer={(value) => updateAnswer(question, value)} />
                    </div>
                ))}

            {!isSubmitAllowed && (
                <div className={styles.submitError}>
                    We need your feedback on required (*) fields.
                </div>
            )}


            <div className={styles.actionContainer}>
                <Button onClick={handleSubmit}>
                    Submit Feedback
                </Button>
            </div>

            {/* <div >
                <pre>
                    {JSON.stringify(answers, null, 4)}
                </pre>
            </div> */}

            <Snooze id={item.id} kind={item.kind} />
        </>
    )
};
