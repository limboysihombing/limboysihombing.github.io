import api from './api.js'
import db from './db.js'
document.addEventListener("DOMContentLoaded", () => {
  let urlParams = new URLSearchParams(window.location.search);
  let isFromSaved = urlParams.get("saved");
  let idParam = urlParams.get("id")

  let btnSave = document.getElementById("save");

  if(isFromSaved) {
    btnSave.style.display = "none"
    api.getSavedTeamById();
  } else {
    let team = api.getTeamDetail(idParam)
    db.checkDataExists(idParam, "teams").then(status => {
      if(status === 0) {
        btnSave.onclick = () => {
          team.then(obj => {
            db.saveTeam(obj)
          })  
          btnSave.style.display = "none"
        }
      } else {
        btnSave.style.display = "none"
      }
    })
  }
})