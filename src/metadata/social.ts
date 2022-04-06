import { FABrandsIcons, FASolidIcons, IconDefinition } from '@kubevious/ui-components';

export const GITHUB_SUBMIT_ISSUE_URL = 'https://github.com/kubevious/kubevious/issues/new/choose';

export const SOCIAL_LINKS : SocialLink[] = [
    { 
        name: 'GitHub',
        url: 'https://github.com/kubevious/kubevious',
        icon: FABrandsIcons.faGithub
    },
    { 
        name: 'Twitter',
        url: 'https://twitter.com/kubevious',
        icon: FABrandsIcons.faTwitter
    },
    { 
        name: 'Slack',
        url: 'https://kubevious.io/slack',
        icon: FABrandsIcons.faSlack
    },
    { 
        name: 'YouTube',
        url: 'https://kubevious.io/youtube',
        icon: FABrandsIcons.faYoutube
    },
    { 
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/company/kubevious',
        icon: FABrandsIcons.faLinkedin
    },
    { 
        name: 'Facebook',
        url: 'https://www.facebook.com/kubevious/',
        icon: FABrandsIcons.faFacebook
    },
    { 
        name: 'Email',
        url: 'mailto:info@kubevious.io',
        icon: FASolidIcons.faEnvelope
    },
]

export interface SocialLink
{
    name: string,
    url: string,
    icon: IconDefinition,
}