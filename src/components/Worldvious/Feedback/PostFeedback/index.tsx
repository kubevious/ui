import React, { FC } from "react"
import cx from "classnames"
import styles from './styles.module.css';
import { FABrandsIcons, FontAwesomeIcon } from "@kubevious/ui-components/dist";

export const PostFeedback: FC = ({}) => {

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
        <div className={styles.postFeedback}>

            <div className={styles.submitMessage}>
                Please share with your friends how you liked Kubevious:
            </div>

            <div className={styles.shareButtons}>
                
                <a
                    type="button"
                    className={cx(styles.shareButton, styles.btnTwitter)}
                    href={composeTweet()}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Tweet it
                    <FontAwesomeIcon icon={FABrandsIcons.faTwitterSquare} size="2x" />
                </a>

                <a
                    type="button"
                    className={cx(styles.shareButton, styles.btnFb)}
                    href={composeFBpost()}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Share on Facebook
                    <FontAwesomeIcon icon={FABrandsIcons.faFacebookSquare} size="2x" />
                </a>

                <a
                    type="button"
                    className={cx(styles.shareButton, styles.btnLinkedIn)}
                    href={composeLinkedInpost()}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Post on LinkedIn
                    <FontAwesomeIcon icon={FABrandsIcons.faLinkedin} size="2x" />
                </a>

            </div>
        </div>
    )
}
