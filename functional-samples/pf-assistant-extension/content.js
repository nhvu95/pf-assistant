let ATTRIBUTES = {};

let HTML_CODES = [];

let DEFAULT_ATTRIBUTE = `{
    "tshirt": {
        "Fit": ["Slim-Fitting"],
        "Pattern": ["Graphic"],
        "Sleeve Type": ["Regular"],
        "Size Type": ["Regular"],
        "Style": ["Basic","Casual"],
        "Neckline": ["Crew Neck"]
    },
    "sweatshirt": {
        "Fit": ["Slim-Fitting"],
        "Pattern": ["Graphic"],
        "Size Type": ["Regular"],
        "Style": ["Basic","Casual"],
        "Neckline": ["Crew Neck"]
    },
    "hoodie": {
        "Fit": ["Slim-Fitting"],
        "Pattern": ["Graphic"],
        "Size Type": ["Regular"],
        "Style": ["Basic","Casual"],
        "Neckline": ["Crew Neck"]
    }
}`;

let SIZE_CHART_NAMES = [];

let DEFAULT_HTMLCODES = `<p><br></p>
<p data-pm-slice="1 1 []"><strong>Description</strong></p>
<p><br></p>
<p>Welcome to my Shop!</p>
<p><br></p>
<p>If you are looking for soft, comfy, first-rate shirts, you&apos;re in the right place! I love what I do and strive to make your shopping experience just right for you. If you have any questions or concerns, need to custom design, or choose another color on my products, feel free to send a message anytime.</p>
<p>The highlight of this product is the images printed on the sweatshirt using advanced digital printing technology.</p>
<p>These images are not embroidered but are printed directly on the fabric, so they do not peel off or fade over time.</p>
<p><br></p>
<p>1. Tshirt:</p>
<p>- 100% Cotton</p>
<p>- Dark Heather, Heather Colors, Safety Colors, and tweed are 50/50 cotton/polyester</p>
<p>- Antique colors &amp; Sport Grey are 90/10 cotton/polyester</p>
<p>- Ash Grey is 99/1 cotton/polyester</p>
<p>- Classic width, rib collar</p>
<p>- Taped neck and shoulders for comfort and durability</p>
<p><br></p>
<p>2. Sweatshirt/ Hoodie</p>
<p>- 50/50 cotton/polyester</p>
<p>- Heather Sport colors are 60/40 polyester/cotton</p>
<p>- Classic fit</p>
<p>- 1x1 rib with spandex for enhanced stretch and recovery</p>
<p>Safety Green is compliant with ANSI / ISEA 107 high-visibility standards</p>
<p>All sweatshirts are unisex, classic fit. Please refer to the size chart in the listing photos for details.</p>
<p>Easy measuring tip: Take your favorite shirt, lay it on a flat surface, and measure the width (armpit to armpit) and length (top to bottom)</p>
<p><br></p>
<p>RETURNS OR EXCHANGES</p>
<p>All of our shirts are custom printed so we do not accept returns or exchanges due to the sizing so please make sure you take all the steps to ensure you get the size you want.</p>
<p>However, if there are any issues with the shirt itself, please message us and we&apos;d be happy to help correct the error.</p>
<p><br></p>
<p>PRODUCTION AND SHIPPING</p>
<p>Production: 1-3 days</p>
<p>Standard Shipping : 3-6 business days after production time</p>
<p><br></p>
<p>THANK YOU!</p>
<p><br></p>
<p>&bull; Seller information: Business name</p>
<p>&bull; Business address: Texas, United States</p>
<p><br></p>`;

function createPFAssistantButton(label, callback) {
    const button = document.createElement('button');
    const divWrapper = document.createElement('div');
    const spinner = document.createElement('div');

    divWrapper.className = 'button-assistant-wrapper';
    spinner.id = 'aiSpinner';
    spinner.classList.add('hidden');
    button.className = 'button-85';
    button.textContent = 'PF Assistant';
    button.addEventListener('click', () => {
        callback();
    });
    divWrapper.appendChild(spinner);
    divWrapper.appendChild(button);
    label.insertAdjacentElement('afterend', divWrapper);
}

function assistantForDescription(descriptionLabel, type) {
    const descriptionText = HTML_CODES.find(i => i.name === type).code;

    const grandParent = descriptionLabel.parentElement.parentElement.parentElement;
    const editor = grandParent.querySelector('div[contenteditable="true"]');
    if (editor) {
        editor.innerHTML = descriptionText;
    }
}

/**
 * Assistant for the attributes
 * @param attributeLabel string
 * @param type 'tshirt' | 'sweatshirt' | 'hoodie'
 */
function assistantForAttributes(attributeLabel, type) {
    const grandParent = attributeLabel.parentElement.parentElement.parentElement;
    const questions = grandParent.querySelectorAll('.grid label.font-semibold');
    questions.forEach((questionLabel, index) => {
        setTimeout(() => handleQuestion(questionLabel, type), index * 200);
    });
}

/**
 * Handle the question based on the type
 * @param questionLabel HTMLElement
 * @param type 'tshirt' | 'sweatshirt' | 'hoodie'
 */
function handleQuestion(questionLabel, type) {
    const text = questionLabel.textContent;
    const input = questionLabel.nextElementSibling.querySelector('input');
    const suggestions = ATTRIBUTES[type][text];
    if (suggestions) {
        input.click();
        setTimeout(() => selectSuggestions(suggestions, input), 100);
    }
}

/**
 * Select the values from the suggestions
 * @param suggestions `{[question: string]: answers[]}`
 * @param input HtmlElement
 */
function selectSuggestions(suggestions, input) {
    document.querySelectorAll('li[role="option"]').forEach(option => {
        const isSelected = option.attributes['aria-selected'];
        const shouldSelect = suggestions.includes(option.textContent);
        if ((shouldSelect && !isSelected) || (!shouldSelect && isSelected)) {
            option.querySelector('label').click();
        }
    });
    input.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            bubbles: true,
            cancelable: true
        })
    );
}

function assistantForProductName(productNameLabel, button, spinner) {
    const grandParent = productNameLabel.parentElement.parentElement.parentElement;
    const spans = grandParent.querySelectorAll('span');
    const recommendationLabel = Array.from(spans).find(span => span.textContent === 'Recommendations');
    const suggestions = [];
    if (recommendationLabel) {
        const points = recommendationLabel.nextElementSibling.querySelectorAll('p');
        points.forEach(point => {
            suggestions.push(point.textContent);
        });
    }
    const keywords = [];
    const recommendationContainer = grandParent.querySelector('div[class^="RecommendContainer"]');
    if (recommendationContainer) {
        recommendationContainer.querySelectorAll('button').forEach(btn => {
            keywords.push(btn.textContent);
        });
    }
    let productTitle = '';
    const productTitleInput = grandParent.querySelector('div[contenteditable="true"]');
    if (productTitleInput) {
        productTitle = productTitleInput.textContent;
    }

    // Send POST request to the API
    chrome.storage.local.get(['token'], result => {
        if (result.token) {
            button.disabled = true;
            spinner.classList.remove('hidden');
            fetch('https://api.privatefulfillment.com/tool/product-title/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${result.token}`
                },
                body: JSON.stringify({
                    productTitle: productTitle,
                    suggestions: suggestions,
                    recommendedKeywords: keywords
                })
            })
                .then(response => response.text())
                .then(data => {
                    productTitleInput.textContent = String(data);
                    button.disabled = false;
                    spinner.classList.add('hidden');
                })
                .catch(error => {
                    button.disabled = false;
                    spinner.classList.add('hidden');
                    console.error('Error:', error);
                });
        } else {
            console.error('No token found');
        }
    });
}

/**
 * Create a dropdown for the Attribute label
 * @param attributeLabel HTMLElement
 */
function createAttributeDropdowns(attributeLabel) {
    const dropdown = document.createElement('select');
    dropdown.placeholder = 'Clothing Type';

    const defaultOption = document.createElement('option');
    defaultOption.text = 'Clothing Type';
    defaultOption.value = '';
    dropdown.add(defaultOption);

    const tshirtOption = document.createElement('option');
    tshirtOption.text = 'T-SHIRT';
    tshirtOption.value = 'tshirt';
    dropdown.add(tshirtOption);

    const sweatshirtOption = document.createElement('option');
    sweatshirtOption.text = 'SWEATSHIRT';
    sweatshirtOption.value = 'sweatshirt';
    dropdown.add(sweatshirtOption);

    const hoodieOption = document.createElement('option');
    hoodieOption.text = 'HOODIE';
    hoodieOption.value = 'hoodie';
    dropdown.add(hoodieOption);

    dropdown.addEventListener('change', () => {
        if (dropdown.value.length > 0) {
            const allP = document.querySelectorAll('p');
            const showMore = Array.from(allP).find(p => p.textContent === 'Show more');
            if (showMore) showMore.click();
            assistantForAttributes(attributeLabel, dropdown.value);
        }
    });
    const wrapper = document.createElement('div');
    wrapper.className = 'button-85 button-wrapper';
    wrapper.appendChild(dropdown);
    attributeLabel.insertAdjacentElement('afterend', wrapper);
}

/**
 * Create a button for the Description label
 * @param descriptionLabel HTMLElement
 */
function createDescriptionButton(descriptionLabel) {
    const dropdown = document.createElement('select');
    dropdown.placeholder = 'Html Template';

    const defaultOption = document.createElement('option');
    defaultOption.text = 'None';
    defaultOption.value = '';
    dropdown.add(defaultOption);

    HTML_CODES.map(i => i.name).forEach(name => {
        const tshirtOption = document.createElement('option');
        tshirtOption.text = name;
        tshirtOption.value = name;
        dropdown.add(tshirtOption);
    });

    dropdown.addEventListener('change', () => {
        if (dropdown.value.length > 0) {
            assistantForDescription(descriptionLabel, dropdown.value);
        }
    });
    const wrapper = document.createElement('div');
    wrapper.className = 'button-85 button-wrapper';
    wrapper.appendChild(dropdown);
    descriptionLabel.insertAdjacentElement('afterend', wrapper);
}

/**
 * Create a button for the Product Name label
 * @param productNameLabel HTMLElement
 */
function createProductNameButton(productNameLabel) {
    const button = document.createElement('button');
    const divWrapper = document.createElement('div');
    const spinner = document.createElement('div');

    divWrapper.className = 'button-assistant-wrapper';
    spinner.id = 'aiSpinner';
    spinner.classList.add('hidden');
    button.className = 'button-85';
    button.textContent = 'PF Assistant';
    button.addEventListener('click', () => {
        assistantForProductName(productNameLabel, button, spinner);
    });
    divWrapper.appendChild(spinner);
    divWrapper.appendChild(button);
    productNameLabel.insertAdjacentElement('afterend', divWrapper);
}

function ClickEvent() {
    return new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 0
        /* whatever properties you want to give it */
    });
}

function MouseOverEvent() {
    return new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 0
        /* whatever properties you want to give it */
    });
}

function MouseOutEvent() {
    return new MouseEvent('mouseout', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 0
        /* whatever properties you want to give it */
    });
}

/**
 * Assistant for the Size Chart
 * @param sizeChartLabel HTMLElement
 * @param imageName string
 */
function assistantForSizeChart(sizeChartLabel, imageName) {
    const parent = sizeChartLabel.parentElement.parentElement.parentElement;
    const deleteIcon = parent.querySelector('svg.theme-arco-icon-delete');
    if (deleteIcon) deleteIcon.dispatchEvent(ClickEvent());
    const uploadImageContainer = document.querySelector('div[class^="ProductUpload"] span > div');
    setTimeout(() => {
        uploadImageContainer.dispatchEvent(MouseOverEvent());
    }, 200);
    setTimeout(() => {
        const mediaIcon = document.querySelector('.theme-arco-popover-inner .theme-arco-icon-file_image');
        if (mediaIcon) mediaIcon.parentElement.dispatchEvent(ClickEvent());
        uploadImageContainer.dispatchEvent(MouseOutEvent());
    }, 500);
    if (!imageName) {
        setTimeout(() => {
            const imageSizeChart = document.querySelector('.theme-arco-modal-wrapper img');
            imageSizeChart.dispatchEvent(MouseOverEvent());
            const container = imageSizeChart.parentElement;
            container.querySelector('label.theme-arco-radio')?.click();
        }, 2000);
        setTimeout(() => {
            document.querySelector('.theme-arco-modal-footer button.theme-arco-btn-primary').click();
        }, 3000);
    } else {
        setTimeout(() => {
            const images = document.querySelectorAll('.theme-arco-modal-wrapper .grid > div');
            images.forEach(image => {
                if (image.textContent.toLowerCase() === imageName.toLowerCase()) {
                    image.querySelector('img').dispatchEvent(MouseOverEvent());
                    const container = image.querySelector('img').parentElement;
                    container.querySelector('label.theme-arco-radio')?.click();
                }
            });
        }, 2000);
        setTimeout(() => {
            document.querySelector('.theme-arco-modal-footer button.theme-arco-btn-primary').click();
        }, 3000);
    }
}

/**
 * Create a button for the Product Name label
 * @param sizeChartLabel HTMLElement
 */
function createSizeChartButton(sizeChartLabel) {
    if (SIZE_CHART_NAMES.length > 1) {
        const dropdown = document.createElement('select');
        dropdown.placeholder = 'Clothing Type';
        const defaultOption = document.createElement('option');
        defaultOption.text = 'Clothing Type';
        defaultOption.value = '';
        dropdown.add(defaultOption);

        SIZE_CHART_NAMES.forEach(name => {
            const defaultOption = document.createElement('option');
            defaultOption.text = name;
            defaultOption.value = name;
            dropdown.add(defaultOption);
        });

        dropdown.addEventListener('change', () => {
            if (dropdown.value.length > 0) {
                assistantForSizeChart(sizeChartLabel, dropdown.value);
            }
        });
        const wrapper = document.createElement('div');
        wrapper.className = 'button-85 button-wrapper';
        wrapper.appendChild(dropdown);
        sizeChartLabel.insertAdjacentElement('afterend', wrapper);
    } else {
        createPFAssistantButton(sizeChartLabel, () => {
            assistantForSizeChart(sizeChartLabel);
        });
    }
}

/**
 * Initialize the layout
 */
function initializeLayout() {
    const paragraphs = document.querySelectorAll('p');
    let productNameLabel = null;
    let attributeLabel = null;
    let descriptionLabel = null;
    let sizeChartLabel = null;
    paragraphs.forEach(p => {
        if (p.textContent.includes('Product name')) {
            productNameLabel = p;
        } else if (p.textContent.includes('Attribute')) {
            attributeLabel = p;
        } else if (p.textContent.includes('Description')) {
            descriptionLabel = p;
        } else if (p.textContent.includes('Size information')) {
            sizeChartLabel = p;
        }
    });

    if (productNameLabel && !productNameLabel.nextElementSibling) {
        createProductNameButton(productNameLabel);
    }

    if (attributeLabel && !attributeLabel.nextElementSibling) {
        createAttributeDropdowns(attributeLabel);
    }

    if (descriptionLabel && !descriptionLabel.nextElementSibling) {
        createDescriptionButton(descriptionLabel);
    }

    if (sizeChartLabel && !sizeChartLabel.nextElementSibling) {
        createSizeChartButton(sizeChartLabel);
    }
}

function saveCodesToStore() {
    chrome.storage.local.set({ HTML_CODES }, () => {
        console.log('HTML codes saved to store.');
    });
}

function loadConfiguration() {
    chrome.storage.local.get(['ATTRIBUTE'], result => {
        if (result.ATTRIBUTE) {
            ATTRIBUTES = JSON.parse(result.ATTRIBUTE);
        } else {
            ATTRIBUTES = JSON.parse(DEFAULT_ATTRIBUTE);
        }
    });
    chrome.storage.local.get(['HTML_CODES'], result => {
        console.log(result.HTML_CODES);
        if (result.HTML_CODES) {
            HTML_CODES = result.HTML_CODES;
        } else if (!result.HTML_CODES || result.HTML_CODES.length === 0) {
            HTML_CODES.push({ name: 'Default', code: DEFAULT_HTMLCODES });
            saveCodesToStore();
        }
    });

    chrome.storage.local.get(['SIZE_CHART_NAMES'], result => {
        console.log(result.SIZE_CHART_NAMES);
        if (result.SIZE_CHART_NAMES) {
            SIZE_CHART_NAMES = result.SIZE_CHART_NAMES.split('\n')
                .map(i => i.trim())
                .filter(i => i.length > 0);
        } else if (!result.SIZE_CHART_NAMES || result.SIZE_CHART_NAMES.trim().length === 0) {
            SIZE_CHART_NAMES = [];
        }
    });
}

loadConfiguration();
chrome.storage.local.get(['token'], result => {
    if (result.token) {
        // Handle the case where the page is already loaded
        window.addEventListener('DOMContentLoaded', () => {
            initializeLayout();
        });

        // Handle the case where the page is changed
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if ((mutation.type === 'childList' || mutation.type === 'subtree') && mutation.addedNodes.length > 0) {
                    initializeLayout();
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
});
