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

function showSavedIcon(id) {
    document.getElementById(id).classList.remove('hidden');
    setTimeout(() => {
        document.getElementById(id).classList.add('hidden');
    }, 2000);
}

function saveSizeChart() {
    const sizeChart = document.getElementById('sizeChart').value;
    chrome.storage.local.set({ SIZE_CHART_NAMES: sizeChart }, () => {
        console.log('Size chart saved to store.');
        showSavedIcon('iconSavedChartSize');
    });
}

function saveAttribute() {
    const attribute = document.getElementById('attribute').value;
    chrome.storage.local.set({ ATTRIBUTE: attribute }, () => {
        console.log('Attribute saved to store.');
        showSavedIcon('iconSavedAttribute');
    });
}

function addCode() {
    const name = document.getElementById('templateName').value;
    const code = document.getElementById('htmlCode').value;
    if (code && name) {
        HTML_CODES.push({ name, code });
        addATableRowCodes(name, code);
        saveCodesToStore();
    }
}

function deleteCode(name, button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    HTML_CODES = HTML_CODES.filter(code => code.name !== name);
    saveCodesToStore();
}

function saveCodesToStore() {
    chrome.storage.local.set({ HTML_CODES }, () => {
        console.log('HTML codes saved to store.');
        showSavedIcon('iconSavedHTML');
    });
}

function addATableRowCodes(name, code) {
    if (code && name) {
        const table = document.getElementById('codeTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
        const nameCell = newRow.insertCell(0);
        const codeCell = newRow.insertCell(1);
        const actionCell = newRow.insertCell(2);
        const btnDelete = document.createElement('button');
        btnDelete.classList.add('btn-delete');
        btnDelete.textContent = 'Delete';
        btnDelete.addEventListener('click', () => deleteCode(name, btnDelete));

        nameCell.textContent = name;
        const codeWrapper = document.createElement('pre');
        codeWrapper.innerHTML = code;
        codeCell.appendChild(codeWrapper);
        actionCell.appendChild(btnDelete);
    }
}

function initializeLayout() {
    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', addCode);
    chrome.storage.local.get(['HTML_CODES'], result => {
        if (result.HTML_CODES) {
            HTML_CODES.push(...result.HTML_CODES);
            HTML_CODES.forEach(row => {
                addATableRowCodes(row.name, row.code);
            });
        }

        if (HTML_CODES.length === 0) {
            HTML_CODES.push({ name: 'Default', code: DEFAULT_HTMLCODES });
            addATableRowCodes('Default', DEFAULT_HTMLCODES);
            saveCodesToStore();
        }
    });

    const saveAttributeBtn = document.getElementById('saveAttribute');
    saveAttributeBtn.addEventListener('click', saveAttribute);
    chrome.storage.local.get(['ATTRIBUTE'], result => {
        if (result.ATTRIBUTE) {
            document.getElementById('attribute').value = result.ATTRIBUTE;
        } else {
            document.getElementById('attribute').value = DEFAULT_ATTRIBUTE;
        }
    });

    const saveChartSizeBtn = document.getElementById('saveChartSize');
    saveChartSizeBtn.addEventListener('click', saveSizeChart);
    chrome.storage.local.get(['SIZE_CHART_NAMES'], result => {
        if (result.SIZE_CHART_NAMES?.length > 0) {
            document.getElementById('sizeChart').value = result.ATTRIBUTE;
        } else {
            document.getElementById('sizeChart').value = '';
        }
    });
}

window.addEventListener('DOMContentLoaded', initializeLayout);
