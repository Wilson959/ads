
// NextGen Ad Blocker for iframe-based Video Hosting Sites
(function() {
    const observer = new MutationObserver(() => {
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                const src = iframe.getAttribute('src');
                if (src && (
                    src.includes('ads') ||
                    src.includes('doubleclick') ||
                    src.includes('adnetwork') ||
                    src.includes('adserve') ||
                    src.includes('promo') ||
                    src.match(/\/ad[s]?\/|ad_[a-z]+\.js/)
                )) {
                    console.log('Blocked Ad iframe:', src);
                    iframe.remove();
                }
            } catch (e) {
                console.warn('Error while blocking iframe ad:', e);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also remove typical ad containers
    const removeAdContainers = () => {
        document.querySelectorAll('[id*="ad"], [class*="ad"]').forEach(el => {
            if (el.tagName !== 'BODY' && el.tagName !== 'HTML') {
                el.remove();
            }
        });
    };

    setInterval(removeAdContainers, 3000);
})();

