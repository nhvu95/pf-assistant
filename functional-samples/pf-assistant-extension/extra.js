let token = '';

function sendEachTitleToApi(productTitle, keywords) {
    return fetch('https://api.privatefulfillment.com/tool/product-title/optimize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            productTitle: productTitle,
            suggestions: [],
            recommendedKeywords: keywords
        })
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('output').value += data + '\n';
        });
}

/**
 * Initialize the layout
 */
function initializeLayout() {
    const btn = document.getElementById('sendBtn');
    btn.addEventListener('click', async () => {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('output').value = '';
        document.getElementById('output').readonly = true;
        const titles = document
            .getElementById('productTitle')
            .value.split('\n')
            .map(i => i.trim())
            .filter(i => i.length > 0);
        const keywords = document
            .getElementById('keywords')
            .value.split(',')
            .map(i => i.trim());
        for (const title of titles) {
            await sendEachTitleToApi(title, keywords);
        }
        document.getElementById('output').readonly = false;
        document.getElementById('spinner').classList.add('hidden');
    });
}

chrome.storage.local.get(['token'], result => {
    if (result.token) {
        token = result.token;
        // Handle the case where the page is already loaded
        window.addEventListener('DOMContentLoaded', () => {
            initializeLayout();
        });
    }
});
