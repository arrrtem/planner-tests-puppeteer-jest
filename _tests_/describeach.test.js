const puppeteer = require('puppeteer');
const assert = require('assert');
const expect = require('expect-puppeteer');
const data = require('./planner_vars');
const { isElementTextMatchText, getTextContents } = require("./utilities");

const toolURL = "https://www.reiseimpfplaner.de";
const destination = data.country.australia;
const width = 1920;
const height = 1080;

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: true,
        slowMo: false,
        ignoreDefaultArgs: ['--disable-extensions'],
        args: [`--window-size=${width},${height}`]
    });
    page = await browser.newPage();
    await page.setViewport({ width, height });
});
afterAll(() => {
    browser.close();
});

describe.each([
    [0, data.traverConditionSelectorsList.langzeitaufenthalt, data.traverConditionName.langzeitaufenthalt, true],
    [1, data.traverConditionSelectorsList.backpacking, data.traverConditionName.backpacking, true],
    [2, data.traverConditionSelectorsList.hotelKreuzfahrtMitAusflügen, data.traverConditionName.hotelKreuzfahrtMitAusflügen, false],
    [3, data.traverConditionSelectorsList.hotelurlaubOhneAusflüge, data.traverConditionName.hotelurlaubOhneAusflüge, false],
    [4, data.traverConditionSelectorsList.grobstadturlaub, data.traverConditionName.grobstadturlaub, false]
])
    ("Planner tool is accessible and works", (travelCondIndex, travelCondSelector, travelCondName, isYellowCardPresented) => {
        test("User can access step 1 and select the destination", async () => {
            const response = await page.goto(toolURL);
            assert.strictEqual(200, response.status());
            await page.setCookie({
                'value': '{"consent_date":"2020-06-03T08:54:26.425Z","consent_type":1}',
                'expires': Date.now() / 1000 + 10,
                'domain': 'www.reiseimpfplaner.de',
                'name': '_evidon_consent_cookie'
            });

            await page.waitForSelector('a.cta-big');
            await page.click('a.cta-big');
            await page.waitForSelector('div.autocomplete');
            const destinationFieldSelector = "input.county-picker";
            await page.type(destinationFieldSelector, destination);
            await page.waitForSelector('ul.autocomplete-result-list li');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForSelector('.tool-next');
            await page.click('.tool-next');
        }, 5000),

        test("User can access step 2 and select the travel condition", async () => {
            await page.waitForSelector(travelCondSelector);
            const titleOnStep2 = "div.tool-intro h1";
            // await expect(page).toMatchElement("div.tool-intro", { text: "Impfung planen.Entspannt reisen." });    
            isElementTextMatchText(titleOnStep2, "Impfung planen.Entspannt reisen.");         
            await page.click(travelCondSelector);
            await page.click('.tool-next');
        }, 5000),

        test("User can access step 3 result page and check the Yellow, Standard vaccination, Last minute cards presence", async () => {
            const lastMinuteCardTitle = "li.card-green h3";
            const yellowCardTitle = "li.card-yellow div.card-title h3";

            const resultsFilterSelector = "div.results-filter";
            await page.waitForSelector(resultsFilterSelector);

            // const travel_conditions = await page.$$eval("div.filter-results div.filter-result-item",
            // items => { return items.map(item => item.textContent) });
            const travel_conditions = await getTextContents("div.filter-results div.filter-result-item");

            assert.strictEqual(5, travel_conditions.length);
            assert.strictEqual(travel_conditions[travelCondIndex], travelCondName);

            const titleTopOnPage3 = "div.results-header h1:nth-child(1)";
            const titleBelowOnPage3 = "div.results-header h1:nth-child(3)";
            // await expect(page).toMatchElement(titleTopOnPage3, { text: 'Empfohlene Reiseimpfungen für deine' });
            isElementTextMatchText(titleTopOnPage3, 'Empfohlene Reiseimpfungen für deine');
            // await expect(page).toMatchElement(titleBelowOnPage3, { text: `Reise nach ${destination}` });
            isElementTextMatchText(titleBelowOnPage3, `Reise nach ${destination}`);

            await page.waitForXPath("//h3[text()='Standardimpfungen']/parent::div/following::div/div/p");
            isElementTextMatchText(lastMinuteCardTitle, "Last-Minute-Reise geplant?");

            if (isYellowCardPresented) {
                const yellowCardElement = await page.$("li.card-yellow");
                // await expect(page).toMatchElement("li.card-yellow div.card-title h3", { text: "Unter 25 Jahre alt?" });
                isElementTextMatchText(yellowCardTitle, "Unter 25 Jahre alt?");
                await expect(yellowCardElement).toMatch("Für Jugendliche und junge Erwachsene besteht ein erhöhtes Ansteckungsrisiko für Meningokokken");
            } else {
                const isYellowCardExists = await page.$(".card-yellow");
                await assert(!isYellowCardExists, "yellow card is exist, but shouldn't");
            }
        }, 5000)
    })