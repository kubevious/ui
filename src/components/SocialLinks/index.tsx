import React, { FC } from 'react';
import { FontAwesomeIcon } from '@kubevious/ui-components';

import styles from './styles.module.css';


import { SOCIAL_LINKS } from '../../metadata/social';

export const SocialLinks: FC = () => {

    return <>
        <div className={styles.socialLinksContainer}>
            {SOCIAL_LINKS.map((x, index) => 

                <a key={index}
                   href={x.url} 
                   className={styles.socialIcon}
                   target="_blank"
                   rel="noopener noreferrer"
                   >
                    <FontAwesomeIcon icon={x.icon}
                                    size="2x"
                                    />
                </a>
            )}
        </div>
    </>;

}