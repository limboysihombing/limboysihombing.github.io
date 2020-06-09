import api from './api.js'
const view = {
  loadPage : (page) => {
    // let page = window.location.hash.substr(1);
    if (page === "") page = "home";


    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        const content = document.querySelector("#body-content");
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
          if(page === "home") {
            configureHome()
          } else if (page === "saved-teams") {
            api.getSavedTeams()
          } else if (page === "saved-matches") {
            api.getSavedMatches()
          }
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "/src/pages/" + page + ".html", true);
    xhttp.send();
  },



}


function configureHome() {
  
  const elems = document.querySelectorAll('select');
  M.FormSelect.init(elems, options);

  const select = document.getElementById('options')
  select.addEventListener("change", () => {
    api.getStandings(select.value)
  });
  api.getStandings(select.value)
  
  document.getElementById('clasement').addEventListener("click", (e) => {  
    api.getStandings(select.value)
  })
  document.getElementById('list_match').addEventListener("click", (e) => {
    api.getMatchOfLeague(select.value)
  })
}


export default view;