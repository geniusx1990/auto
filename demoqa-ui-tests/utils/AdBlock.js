const AD_DOMAINS = new Set([
    'googlesyndication.com',
    'doubleclick.net',
    'google-analytics.com',
    'adnxs.com',
    'advertising.com',
    'adform.net',
    'criteo.com',
    'taboola.com',
    'outbrain.com',
    'pubmatic.com',
    'rubiconproject.com',
    'moatads.com',
    'adsrvr.org',
    'adroll.com',
    'adtechus.com',
    'amazon-adsystem.com',
    'adcolony.com',
]);

function isAdRequest(url) {
    return [...AD_DOMAINS].some(domain => url.includes(domain));
}

class AdBlock {
    static async blockAds(page) {
        await page.route('**/*', route => {
            const url = route.request().url();

            if (isAdRequest(url)) {
                route.abort();
                return;
            }

            route.continue();
        });
    }
}

export default AdBlock;
