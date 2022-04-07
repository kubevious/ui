import React, { FC, useState } from 'react';
import { PostFeedback } from "./PostFeedback"
import _ from "the-lodash"
import cx from "classnames"

import { WorldviousBlock } from '../WorldviousBlock'
import { FeedbackForm } from './FeedbackForm';
import { WorldviousFeedbackRequest } from '@kubevious/ui-middleware/dist/services/worldvious';
import { Snooze } from '../Snooze';
export interface FeedbackProps
{
    item : WorldviousFeedbackRequest;
    onClear? : () => void;
}

export const Feedback : FC<FeedbackProps> = ({ item, onClear }) => {

    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

    const onFeedbackSubmit = () => {
        setIsFormSubmitted(true);
    }

    if (isFormSubmitted) {

        return (
            <WorldviousBlock title="Thank you for your feedback!">
                <PostFeedback />
            </WorldviousBlock>
        );
    }

    return (
        <WorldviousBlock title="Please give us your feedback">
            <FeedbackForm item={item} onPostSubmit={onFeedbackSubmit} />

            <Snooze id={item.id} kind={item.kind} onClear={onClear} />
        </WorldviousBlock>
    )
};
