/**
 * Jest-Puppeteer Unit Testing
 * @ author - Frank Luo
 * Sources Used: 
 * https://www.testim.io/blog/jest-testing-a-helpful-introductory-tutorial/
 * https://www.youtube.com/watch?v=ajiAl5UNzBU 
 */


// Declaring which functions to test
const { loadData, parseData, updateView, updatePresident } = require('./public/javascripts/presidents.js');
const puppeteer = require('puppeteer');
const app = require("./app");

let browser;
let page;

// Declaring constants 
const PAGE_URL = 'http://127.0.0.1:3000/presidents';  
const timeout = 15000;
const TEST_DATA = [
    {
        name: 'George Washington',
        photo: 'GeorgeWashington.jpg',
    },
];

beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(PAGE_URL, { waitUntil: 'load' });
});

afterAll(async () => {
    await browser.close();
});

// Test to load data
describe('Load data', () => {
    it('fetches and returns the presidents data', async () => {
        const data = await loadData('https://api.sampleapis.com/presidents/presidents');
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
    });

    it('error on failed fetch', async () => {
        await expect(loadData('https://fakeerognaerngoaengoeirngon.com/hi')).rejects.toThrow();
    });
});

// Test to parse data
describe('Parse data', () => {
    it('correctly parses a JSON string', () => {
        const jsonString = JSON.stringify([{ name: 'Frank', photo: 'frank.jpg' }]);
        const result = parseData(jsonString);
        expect(result).toEqual([{ name: 'Frank', photo: 'frank.jpg' }]);
    });

    it('throws an error for invalid JSON', () => {
        const invalidJson = "{name: 'Frank'}";
        expect(() => parseData(invalidJson)).toThrow();
    });
});

// Delaying time a little for tests to run 
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  

// Test to update view
describe('Update view', () => {
    beforeAll(async () => {
        await delay(1000);
        await page.evaluate(data => updateView(data), TEST_DATA);
    });

    it('displays the correct president number', async () => {
        const displayedNumber = await page.$eval('#president', el => el.innerText);
        expect(displayedNumber).toBeDefined();
    });

    it('displays the president photo', async () => {
        const photoSrc = await page.$eval('#photo', img => img.src);
        expect(photoSrc).toContain('.jpg');  
    });

    it('updates the result correctly on correct input', async () => {
        await page.type('#input', 'George Washington');  
        await page.click('button');
        const resultText = await page.$eval('#result', div => div.innerText);
        expect(resultText).toBe('Correct! Great Job!');
    });

    it('updates the result correctly on incorrect input', async () => {
        await page.type('#input', 'Andrew Jackson');  
        await page.click('button');
        const resultText = await page.$eval('#result', div => div.innerText);
        expect(resultText).toBe('Incorrect. The President was George Washington.');  
    });
});

// Test to update President
describe('Update President', () => {
    it('displays "Correct! Great Job!" on correct input', async () => {
        await page.evaluate(() => {
            const inputElement = document.getElementById("input");
            inputElement.value = "George Washington";
        });
        
        await page.evaluate(() => updatePresident());
        
        const resultText = await page.$eval('#result', div => div.innerText);
        expect(resultText).toBe('Correct! Great Job!');
    });

    it('displays "Incorrect. The President was ..." on incorrect input', async () => {
        await page.evaluate(() => {
            const inputElement = document.getElementById("input");
            inputElement.value = "Andrew Jackson";
        });
        
        await page.evaluate(() => updatePresident());
        
        const resultText = await page.$eval('#result', div => div.innerText);
        expect(resultText).toBe('Incorrect. The President was George Washington.');
    });
});

// Test for page title and header 
describe('Test page title and header', () => {
    test('page title', async () => {
        const title = await page.title();
        expect(title).toMatch('Pick Your Own API');
    }, timeout);
});

// Mocking Tests for Typing and Pressing Button. Also Getting the Results
describe('Type and Press Button', () => {
    test('Form Input', async () => {
        await page.type('input[id="input"]', "Alexander Hamilton");
    }, timeout);

    test('Click Button and Get Results', async () => {
        await page.click("button", { text: "Submit" });
        const resultText = await page.$eval('#result', div => div.innerText);
        expect(resultText).toContain("Incorrect.");
    }, timeout);
});