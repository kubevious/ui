import React from "react"

import "./styles.scss"
export const PostFeedback: React.FunctionComponent = ({}) => {
    function composeTweet(): string {
        const message =
            "I am a proud @kubevious user and it helps making #Kubernetes easier to use and #DevOps more fun. Now I am a #CloudNative #SRE with superpowers!\n\nTry it yourself: https://kubevious.io"
        const text = encodeURIComponent(message)
        const url = `https://twitter.com/intent/tweet?text=${text}`
        return url
    }

    function composeFBpost(): string {
        const message =
            "I am a proud @kubevious user and it helps making #Kubernetes easier to use and #DevOps more fun. Now I am a #CloudNative #SRE with superpowers!\n\nTry it yourself: https://kubevious.io"
        const text = encodeURIComponent(message)
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            "https://kubevious.io"
        )}&quote=${text}`
        return url
    }

    function composeLinkedInpost(): string {
        const url = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
            "https://kubevious.io"
        )}`
        return url
    }

    return (
        <div className="separate-container post-feedback">
            <div className="completed-screen">
                <div className="submit-thank">Thank you for your feedback!</div>
                <div className="submit-share">
                    You can also tell your friends how you liked Kubevious:
                </div>
                <div className="share-buttons">
                    <a
                        type="button"
                        className="btn-twitter"
                        href={composeTweet()}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Tweet it
                        <img
                            src="./img/social/twitter.svg"
                            alt="Tweet it"
                        ></img>
                    </a>
                    <a
                        type="button"
                        className="btn-fb"
                        href={composeFBpost()}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Share on Facebook
                        <img
                            src="./img/social/facebook.svg"
                            alt="Share on Facebook"
                        ></img>
                    </a>
                    <a
                        type="button"
                        className="btn-linkedin"
                        href={composeLinkedInpost()}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Post on LinkedIn
                        <img
                            src="./img/social/linkedin.svg"
                            alt="Post on LinkedIn"
                        ></img>
                    </a>
                </div>
            </div>
        </div>
    )
}