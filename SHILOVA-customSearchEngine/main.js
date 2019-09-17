"use strict";

// Information to reach API
var url = 'https://www.googleapis.com/customsearch/v1?';
var apiKey = 'key=AIzaSyDiAg6Yx4YPLvlLDwPXH0pD2blULPBk03A';
var cx = '&cx=008993671637674012003:4dteg0svhu8';


// Selecting page elements
var inputField = document.querySelector('.searchInput');
var submit = document.querySelector('.searchButton');
var responseField = document.querySelector('.searchResult');


// AJAX function
var getSuggestions = function getSuggestions() {
    var query = inputField.value;
    var endpoint = "".concat(url).concat(apiKey).concat(cx, "&q=").concat(query);
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            renderResponse(xhr.response.items);
        }
    };

    xhr.open('GET', endpoint);
    xhr.send();
};



//help render func
// Formats response to look presentable on webpage
var renderResponse = function renderResponse(res) {
    // Handles if res is falsey
    if (!res) {
        console.log(res.status);
    }

    // In case res comes back as a blank array
    if (!res.length) {
        responseField.innerHTML = "<p>Try again!</p><p>There were no suggestions found!</p>";
        return;
    }



    // Creates an empty array to contain the HTML strings
    var resultList = [];

    // Loops through the response and caps off at 10
    for (var i = 0; i < Math.min(res.length, 10); i++) {
        // creating a list of words
        resultList.push("<li>\n    <div class=\"searchResultItem\">\n    <a href=\"".concat(res[i].link, "\" target=\"_blank\">").concat(res[i].title, "</a>\n    <div>").concat(res[i].snippet, "</div>\n    </div>\n    </li>\n    <br>"));
    }



    // Joins the array of HTML strings into one string
    resultList = resultList.join("");


    // Manipulates responseField to render the modified response
    responseField.style.display = "block";
    responseField.innerHTML = "<p>You might be interested in:</p><br><ol>".concat(resultList, "</ol>"); //Adding styles to result list

    responseField.firstChild.setAttribute("class", "textPrependedToResults");
    document.querySelector("footer").setAttribute("class", "moreInfoButton");
    return;
};



// Clear previous results and display results to a webpag
var displaySuggestions = function displaySuggestions(event) {
    event.preventDefault();

    while (responseField.firstChild) {
        responseField.removeChild(responseField.firstChild);
    }

    ;
    getSuggestions();
};


// Search Bar element design transform on Key Up
inputField.addEventListener("keyup", function () {
    document.querySelector(".logo>img").setAttribute("style", "float: left; margin-top: 2%; max-height: 15vh; width: auto; ");
    document.querySelector(".searchBar").setAttribute("style", "justify-content:flex-start; max-width:60%; height: auto;");
});


// Start searching on click
submit.addEventListener("click", displaySuggestions);