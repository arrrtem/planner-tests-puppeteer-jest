
async function getTextContents(selector) {
    const isLoadingSucceeded = await page.$(selector).then(function (res) { return !!res; });
    if (!isLoadingSucceeded) {
        throw new Error(`Element ${selector} not found`);
    }

    let textContent = page.$$eval(selector,
        el => { return el.map(el => el.textContent); });

    return textContent;
}
exports.getTextContents = getTextContents;

async function isElementTextMatchText(selector, expectedText) {
    let elementText = await getTextContents(selector);

    if (elementText != expectedText) {
        throw new Error(`Element ${selector} text doesn't match ${expectedText}`);
    }
}
exports.isElementTextMatchText = isElementTextMatchText;