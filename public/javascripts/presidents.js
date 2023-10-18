/**
 * PickYourOwnAPI JavaScript Code 
 * @author Frank Luo
 * Sources Used: 
 * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction 
 * https://aws.amazon.com/what-is/api/#:~:text=API%20stands%20for%20Application%20Programming,other%20using%20requests%20and%20responses.
 * https://www.youtube.com/watch?v=cuEtnrL9-H0
 * https://www.youtube.com/watch?v=_7rT-ixivWU&t=371s 
 * https://sampleapis.com/api-list/presidents
 * https://api.sampleapis.com/presidents/presidents 
 * https://stackoverflow.com/questions/72434338/using-node-fetch-in-js-file-in-browser-and-in-node?fbclid=IwAR1o5SrdL3_4N4EpU_q2s5xAQuWmOo31u0polJauUGXqT6uDIUf0dxTq480 
 **/

console.log("Hello");

// Allows fetching for unit testing
let fetch = globalThis?.fetch;

if (!fetch && process?.versions?.node) {
    fetch = require('node-fetch')
}

// Declaring president variable that changes
let president;
let presidentUrl = "https://api.sampleapis.com/presidents/presidents";
/**
 * Function returns an object version of JSON string response from the US Election API
 * If program is unable to load JSON, an error message will occur 
 * @param {String} url - API website
 * @returns {Object} - JavaScript object of the JSON string
 */
async function loadData(url) {
    const response = await fetch(url);
    // If response is not successful throw error message
    if (!response.ok) {
        throw new Error("Error Message: " + response.status);
    }
    const result = await response.text();
    // Returns JSON string object 
    return parseData(result);
}

/**
 * Function which accepts a JSON string, and returns an object version of this string 
 *
 * @param {String} jsonString - JSON string 
 * @returns {Object} - JavaScript object of the JSON string
 */
function parseData(jsonString) {
    return JSON.parse(jsonString);
}

/**
 * Function updates view for user 
 * @param {*} listOfPresidents - list of U.S. Presidents
 */
async function updateView(listOfPresidents) {
    // Line retrieves an element from the HTML document with the id 'president' and assigns it to a constant. 
    const numberElement = document.getElementById("president");
    // Randomly generated list of presidents from 1-45 
    const randomIndex = Math.floor(Math.random() * listOfPresidents.length);
    // Displays the President's number in text
    numberElement.innerText = randomIndex + 1;
    console.log(listOfPresidents[randomIndex].photo);
    // Displays photo and name of U.S. President
    document.getElementById("photo").src = listOfPresidents[randomIndex].photo;
    president = listOfPresidents[randomIndex].name;
    console.log(president);
}

/**
 * Function to update the President
 */
async function updatePresident(){
    // Getting input from user and assigning it to variable prez
    const prez = document.getElementById("input").value.toLowerCase().trim();
    console.log(president.toLowerCase(), prez);
    // Comparing the user input with actual answer and displaying a response
    const resultElement = document.getElementById("result");
    if (prez === president.toLowerCase()){
        resultElement.innerText = "Correct! Great Job!";
    }
    else {
        resultElement.innerText = "Incorrect. The President was " + president + ".";
    }
}

// Loading Data beforehand 
if (typeof window !== 'undefined') {
window.onload = function () {
    loadData(presidentUrl).then(data => {
        updateView(data)
          });
    };
}

// Do not remove these lines
if (typeof module != 'undefined') {
    module.exports = {
        loadData: loadData,
        parseData: parseData,
        updateView: updateView,
    };
}
