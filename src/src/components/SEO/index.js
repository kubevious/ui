import React from 'react'
import { Helmet } from 'react-helmet'

const SEO = () => {
    const siteUrl = 'https://demo.kubevious.io/'

    const seo = {
        description: 'Demo work of kubevious application',
        title: 'Kubevious :: Demo',
        keywords: ['kubevious', 'containers', 'docker', 'kubernetes', 'kubernetes dashboard', 'Kubernetes Visualized', 'kubernetes blog', 'kubevious demo'],
        image: `${siteUrl}img/site-preview.jpg`
    }

    return (
        <Helmet>
            <meta name="description" content={seo.description} />
            <meta name="title" content={seo.title} />
            <meta name="keywords" content={seo.keywords} />

            <meta name="og:image" content={seo.image} />
            <meta name="og:image:alt" content={seo.title} />
            <meta name="og:image:width" content="850" />
            <meta name="og:image:height" content="350" />

            <meta name="og:url" content={siteUrl} />
            <meta name="og:type" content="website" />
            <meta name="og:description" content={seo.description} />
            <meta name="og:title" content={seo.title} />
        </Helmet>
    )
}

export default SEO
