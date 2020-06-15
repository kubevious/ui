import React from 'react'
import { Helmet } from 'react-helmet'

const SEO = () => {
    return(
        <Helmet>
            {process.env.NODE_ENV === 'production' && process.env.REACT_APP_DEMO_APP && <script type="text/javascript">
                {`(function (w, d, s, l, i) {
                        w[l] = w[l] || [];
                        w[l].push({
                            'gtm.start':
                                new Date().getTime(), event: 'gtm.js'
                        });
                        var f = d.getElementsByTagName(s)[0],
                            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                        j.async = true;
                        j.src =
                            'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                        f.parentNode.insertBefore(j, f);
                    })(window, document, 'script', 'dataLayer', 'GTM-5Q25Q6P');`}
            </script>}
        </Helmet>
    )
}

export default SEO