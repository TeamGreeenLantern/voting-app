//query selectors
let electionDayContainerEl = document.querySelector(".election-display");
let voterInfoEl = document.querySelector(".voter-info");
let websiteNameEl = document.querySelector(".website-name");
let websiteAddressElEl = document.querySelector(".website-link");
let modalEl = document.querySelector(".modal");
let newsModalEl = document.querySelector("#news-modal");
let errorModalEl = document.querySelector("#error-modal");
let newsModalContentEl = document.querySelector(".news");
let newsModalDeleteEl = document.querySelector("#news-modal-delete");
let modalHeading = document.querySelector(".modal-card-title");

//get the entered address and use
let userAddress = localStorage.getItem("address");

let electionDisplay = function () {
  let apiUrl =
    "https://civicinfo.googleapis.com/civicinfo/v2/elections?key=AIzaSyCaQylnKFXTaeh7o8Vuenj8LKnFkcr6nQE";

  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        errorModalEl.classList.add("is-active");
        return;
      }
      return response.json();

    })
    .then(function (data) {

      //this is to display all upcoming elections
      for (let i = 1; i < data.elections.length; i++) {
        let electionName = document.createElement("h2");
        electionName.classList.add("election-header");
        electionName.textContent = data.elections[i].name;
        electionDayContainerEl.appendChild(electionName);
        let electionDate = moment(data.elections[i].electionDay).format(
          "dddd, MMMM, Do, YYYY");

        let electionDay = document.createElement("p");
        electionDay.classList.add("election-day");

        electionDay.textContent = electionDate;
        electionDayContainerEl.appendChild(electionDay);
      };

      let voterApiUrl =
        `https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?address=${userAddress}&returnAllAvailableData=true&requestBody=true&electionId=7000&key=AIzaSyCaQylnKFXTaeh7o8Vuenj8LKnFkcr6nQE`;
      fetch(voterApiUrl)
        .then(function (response) {
          if (!response.ok) {
            errorModalEl.classList.add("is-active");
            return;
          }
          return response.json();

        })
        .then(function (data) {
          //get the name of the state and the state's website to display
          let siteName = data.state[0].electionAdministrationBody.name;
          let siteAddress =
            data.state[0].electionAdministrationBody.electionInfoUrl;

          websiteNameEl.textContent =
            "Visit the " +
            siteName +
            " website to learn more details about upcoming elections relevant to you.";
          websiteAddressElEl.textContent = "Get More Information from the State's Website";
          websiteAddressElEl.setAttribute("href", siteAddress);
          websiteAddressElEl.setAttribute("target", "_blank");

          voterInfoEl.appendChild(websiteNameEl);
          voterInfoEl.appendChild(websiteAddressElEl);
        })
        //handle errors
        .catch(function (error) {
          errorModalEl.classList.add("is-active");
        });
    });
};

let displayNewsHandler = function (event) {
  //display modal when an election is selected
  let targetedModal = event.target;
  if (targetedModal.matches("h2")) {
    newsModalEl.classList.add("is-active");
  } else {
    return;
  };

  let electionName = targetedModal.textContent;
  modalHeading.textContent = electionName;

  //get news articles with person's name
  let apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${electionName}&election&sort=relevance&news_desk=politics&type_of_material=news&api-key=0LjGSIV1PXpRyRsQkYxlhQe10ryACGHV`

  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        errorModalEl.classList.add("is-active");
        return
      };
      return response.json();
    })
    .then(function (data) {
      //first clear the old content
      newsModalContentEl.textContent = "";

      //getting the 1st 5 articles and displaying them
      for (let i = 0; i < 5; i++) {
        let newsArticles = document.createElement("p");
        newsArticles.classList.add("article-title");

        let articleUrl = document.createElement("a");
        let articleUrlLink = data.response.docs[i].web_url;
        articleUrl.innerHTML = data.response.docs[i].headline.main;
        articleUrl.classList.add("article-link");
        articleUrl.setAttribute("href", articleUrlLink);
        articleUrl.setAttribute("target", "_blank");

        newsModalContentEl.appendChild(newsArticles);
        newsModalContentEl.appendChild(articleUrl);
      }
    })
    //handle errors
    .catch(function (error) {
      errorModalEl.classList.add("is-active");
    })
}

//event listneners
document.addEventListener("click", displayNewsHandler);
//Remove modal on "x" 
newsModalDeleteEl.addEventListener("click", function (event) {
  newsModalEl.classList.remove("is-active");
});

//toggling the hamburger menu
$(document).ready(function () {

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {

    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");

  });
});

electionDisplay();