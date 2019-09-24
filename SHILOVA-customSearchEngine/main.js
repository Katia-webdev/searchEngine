"use strict"; //Getting necessary DOM elements

var inputField = document.querySelector('.searchInput');
var submit = document.querySelector('.searchButton');
var responseField = document.querySelector('.searchResult');
var imageContainer = document.querySelector('.searchImageResult'); // Information to reach API

var url = 'https://www.googleapis.com/customsearch/v1?';
var apiKey = 'key=AIzaSyBhErRZoCNfURi1z1DoQDJXrgnDAKhmZok';
var cx = '&cx=008993671637674012003:y7jt0xhysdv'; //Render function later used inside AJAX - Response Validation + Pagination

var renderResponse = function renderResponse(res) {
  //VALIDATING RESPONSE FIRST
  // Handles if response is falsey
  if (!res) {
    console.log(res.status);
  } // In case response comes back as a blank array


  if (!res.length || res.length == null) {
    document.querySelector(".mainBody").style.visibility = "visible";
    document.querySelector(".mainBody").innerHTML = "<p>Try again!</p><p>There were no suggestions found!</p>";
    return;
  } // Acquiring response data and paginating
  //Preparing for paginating


  var jsonData = res;
  var list = [];
  var imgList = [];
  var pageImgList = [];
  var pageList = [];
  var currentPage = 1;
  var numberPerPage = 4;
  var numberOfPages = 0;
  var imgUrl = new Image(); //Getting page

  function makeList(jsonData) {
    for (var x = 0; x < jsonData.length; x++) {
      //Check if image for the query exists
      if (null != jsonData[x].pagemap.cse_image) {
        imgUrl.src = jsonData[x].pagemap.cse_image[0].src;
      } else {
        imgUrl.src = "https://www.ggf.org.uk/wp-content/uploads/2018/03/jpg-icon.png";
      } //Creating image list for image container


      imgList.push("<img src=\" " + imgUrl.src + "\" height=\"120px\" width=\"auto\"/> "); //Creating text list for text container

      list.push(" <div class=\"searchResultItem\"> " + "<div class=\"resultItemHeader\">" + "<a href=\" " + jsonData[x].link + " \" target=\"_blank\">" + jsonData[x].title + "</a>" + "</div>" + "<br>" + "<div class=\"resultItemBody\"> " + jsonData[x].snippet + "</div>" + "</div>");
    } //Making page buttons appear


    document.querySelector(".pageButtons").style.display = "block"; //Page count logic

    numberOfPages = getNumberOfPages();
  }

  function getNumberOfPages() {
    return Math.ceil(jsonData.length / numberPerPage);
  }

  function nextPage() {
    currentPage += 1;
    loadList();
  }

  function previousPage() {
    currentPage -= 1;
    loadList();
  }

  function firstPage() {
    currentPage = 1;
    loadList();
  }

  function lastPage() {
    currentPage = numberOfPages;
    loadList();
  }
  /*Slicing results per page*/


  function loadList() {
    var begin = (currentPage - 1) * numberPerPage;
    var end = begin + numberPerPage;
    pageList = list.slice(begin, end);
    pageImgList = imgList.slice(begin, end);
    drawList();
    check();
  }
  /*Drawing list*/


  function drawList() {
    responseField.innerHTML = "";
    responseField.style.display = "block";
    imageContainer.innerHTML = "";
    imageContainer.style.display = "block";
    document.querySelector(".mainBody").style.visibility = "visible";

    for (var r = 0; r < pageList.length; r++) {
      responseField.innerHTML += pageList[r] + "<br/>";
    }

    for (var q = 0; q < pageImgList.length; q++) {
      imageContainer.innerHTML += pageImgList[q];
    }
  }
  /*Page buttons logic*/


  function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
  }

  function load() {
    makeList(jsonData);
    loadList();
  } //Calling paginate function with response data


  load(); //Adding event listeners on page Buttons

  document.getElementById("first").addEventListener("click", firstPage);
  document.getElementById("next").addEventListener("click", nextPage);
  document.getElementById("previous").addEventListener("click", previousPage);
  document.getElementById("last").addEventListener("click", lastPage); //

  return;
}; // Clear previous results and display results to webpage


var displaySuggestions = function displaySuggestions(event) {
  event.preventDefault();

  while (responseField.firstChild) {
    responseField.removeChild(responseField.firstChild);
  }

  validateForm();
  ;
  getSuggestions();
}; //Validate form function


var validateForm = function validateForm() {
  if (inputField.value.length == 0 || inputField.value == "") {
    inputField.classList.add("class", "invalidValue");
    inputField.placeholder = "Please fill in the form!";
    return false;
  } else {
    //Resets field back to default
    inputField.classList.remove("invalidValue");
    return true;
  }
}; // AJAX function


var getSuggestions = function getSuggestions() {
  var query = inputField.value;
  var endpoint = "".concat(url).concat(apiKey).concat(cx, "&q=").concat(query);
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      renderResponse(xhr.response.items);
    } else {
      /*Throwing error*/
      document.querySelector(".mainBody").style.visibility = "visible";
      imageContainer.style.display = "none";
      responseField.style.display = "block";
      responseField.style.float = "left";
      responseField.innerHTML = "<p>Try again!</p><p>There were no suggestions found!</p>";
    }
  };

  xhr.open('GET', endpoint);
  xhr.send();
}; // Search Bar design transform on Key Up


inputField.addEventListener("keyup", function () {
  inputField.classList.remove("invalidValue");
  document.querySelector(".logo>img").setAttribute("style", "float: left; max-height: 10vh; width: auto; ");
  document.querySelector(".searchBar").setAttribute("style", "justify-content:flex-start; max-width:60%; height: auto;");
}); // Start searching on click

submit.addEventListener("click", displaySuggestions);