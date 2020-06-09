const base_url = "https://api.football-data.org/v2/"
import db from './db.js'
// Blog kode yang akan di panggil jika fetch berhasil
function status(response) {
  if(response.status !== 200) {
    console.log("Error: " + response.status) 
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi promise agar bisa "di-then-kan"
    return Promise.resolve(response)
  }
}

// Blog kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blog catch
function error(error) {
  // Parameter error berasal dari promise.reject()
  if (!error.response) {
    error.errorStatus = 'Network Error';
  } else {
      error.errorStatus = error.response.data.message;
  }
  console.log("Error : " + error.errorStatus)
}

const fetchApi = url => {    
  return fetch(url, {
    headers: {
      'X-Auth-Token': '60242b92967f45f0860fc16f69f27ec5'
    }
  });
};

const api = {
  getMatchOfLeague : (id) => {
    let matchHtml = 
    `
      <div class="col m12 center loader-animation">
        <div class="preloader-wrapper active">
          <div class="spinner-layer spinner-red-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
      </div>
    `
    document.getElementById("data-league").innerHTML = matchHtml
    if('caches' in window) {
      document.getElementById("league_options_title").innerHTML =  "Daftar Pertandingan"
      caches.match(base_url + `competitions/${id}/matches?status=POSTPONED`).then((response) => {
        
        if(response) {
          response.json().then((data) => {
            
            const {name, area} = data.competition;

            matchHtml = ""
            if(data.count > 0) {
              data.matches.forEach(function(match) {
                let {id,awayTeam, homeTeam, utcDate} = match
                matchHtml += 
                `
                  <div class="col s12 m6">
                    <div class="card">
                      <h6 class="center header col s12">
                        ${utcDate}
                      </h6>
                      <div class="card-content">
                        <div class="team left">
                          
                          <p class="center">${homeTeam.name}</p>
                        </div>
                        <div class="center">
                          <h5>VS</h5>
                        </div>
                        <div class="team right">
                        
                          <p class="center">${awayTeam.name}</p>
                        </div>
                      </div>
                      <span class="save-match-button" id="${id}">🖫</span>
                    </div>
                  </div>
                `
              })
              document.getElementById("data-league").innerHTML = matchHtml
              return(data)

            } else {

              matchHtml = 
              `
              <div class="card">
                <div class="card-content">
                  <div class="card-title orange-text text-darken-4">
                    :( Daftar pertandingan tidak ditemukan atau belum dijadwalkan pada liga ini. bro
                  </div>
                </div>
              </div>
              `
              document.getElementById("data-league").innerHTML = matchHtml
            }
          }).then(data => {
            let btnList = document.getElementsByClassName('save-match-button')
            for(let i = 0; i < btnList.length; i++) {
              btnList[i].addEventListener('click', () => {
                let index = data.matches.findIndex(match => {
                  return match.id === parseInt(btnList[i].id);
                })
                db.saveMatch(data.matches[index])
                btnList[i].style.display = 'none'
              })
              db.checkDataExists(btnList[i].id, "matches").then(status => {
                if(status === 1) {
                  btnList[i].style.display = 'none'
                }
              })
            }
          })
        }
      })
    }


    fetchApi(base_url + `competitions/${id}/matches?status=POSTPONED`)
    .then(status)
    .then(json)
    .then(data => {
      document.getElementById("league_options_title").innerHTML =  "Daftar Pertandingan"
      let matchHtml = ""
      if(data.count > 0) {
        data.matches.forEach(function(match) {
          let {id, awayTeam, homeTeam, utcDate} = match
          matchHtml += 
          `
            <div class="col s12 m6">
              <div class="card z-depth-0">
                <h6 class="center header col s12">
                  ${utcDate}
                </h6>
                <div class="card-content">
                  <div class="team left">
                    
                    <p class="center">${homeTeam.name}</p>
                  </div>
                  <div class="center">
                    <h5>VS</h5>
                  </div>
                  <div class="team right">
                    <p class="center">${awayTeam.name}</p>
                  </div>
                </div>
                <span class="save-match-button" id="${id}">🖫</span>
              </div>
            </div>
          `
        })

        
        document.getElementById("data-league").innerHTML = matchHtml
        return(data)
        
      } else {
        
        matchHtml += 
        `
        <div class="card">
          <div class="card-content">
            <div class="card-title orange-text text-darken-4">
              :( Daftar pertandingan tidak ditemukan atau belum dijadwalkan pada liga ini.
            </div>
          </div>
        </div>
        `
        document.getElementById("data-league").innerHTML = matchHtml
      }
    })
    .then(data => {
      let btnList = document.getElementsByClassName('save-match-button')
      for(let i = 0; i < btnList.length; i++) {
        btnList[i].addEventListener('click', () => {
          let index = data.matches.findIndex(match => {
            return match.id === parseInt(btnList[i].id);
          })
          db.saveMatch(data.matches[index])
          btnList[i].style.display = 'none'
        })
        db.checkDataExists(btnList[i].id, "matches").then(status => {
          if(status === 1) {
            btnList[i].style.display = 'none'
          }
        })
      }
    })
    .catch(error)
  },
  getStandings : (id) => {
    if('caches' in window) {
      caches.match(base_url + `competitions/${id}/standings`).then((response) => {
        if(response) {
          response.json().then((data) => {
            
            document.getElementById("league_options_title").innerHTML =  "Klasemen"
            const {name, area} = data.competition;
            
            let leagueHtml = `
              <div class="col m2 s3">
                <img src="src/images/league/${id}.png" class="responsive-img" alt="League Image">
              </div>
              <div class="col m6 s9">
                <table class="white-text league-detail">
                  <tr>
                    <th>Nama Liga</th>
                    <th>: ${name}</th>
                  </tr>
                  <tr>
                    <td>Area</td>
                    <td>: ${area.name}</td>
                  </tr>
                  <tr>
                    <td>Tanggal Season</td>
                    <td>: ${data.season.startDate} - ${data.season.endDate}</td>
                  </tr>
                </table>
              </div>
            `
            document.getElementById('league').innerHTML = leagueHtml;

            let clasementHtml =""
            data.standings.forEach(function(standing) {
              let {group, type, table} = standing
              if(group === null){
                group = '-'
              }
              clasementHtml += `
              <div class="card">
                <div class="card-title">GRUP: ${group}, TIPE: ${type}</div>
                <div class="divider"></div>
                  <div class="card-content">
                    <table class="responsive-table centered">
                      <thead>
                        <tr>
                            <th>Posisi</th>
                            <th>Logo</th>
                            <th>Nama Club</th>
                            <th>D</th>
                            <th>M</th>
                            <th>S</th>
                            <th>K</th>
                            <th>SG</th>
                            <th>PN</th>
                        </tr>
                      </thead>
                      <tbody>
              `
              table.forEach(data => {
                const imgUrl = data.team.crestUrl.replace(/^http:\/\//i, 'https://')
                clasementHtml += `
                  <tr>
                    <td>${data.position}</td>
                    <td>
                      <a href="/team-detail.html?id=${data.team.id}">
                        <img src="${imgUrl}" class="responsive-img" width="30" alt="${data.team.name}"></td>
                      </a>
                    <td>
                      <a href="./team-detail.html?id=${data.team.id}">
                      ${data.team.name}
                      </a>
                    </td>
                    <td>${data.playedGames}</td>
                    <td>${data.won}</td>
                    <td>${data.draw}</td>
                    <td>${data.lost}</td>
                    <td>${data.goalDifference}</td>
                    <td>${data.points}</td>
                  </tr>
                `
                
              });
              clasementHtml += `
                      </tbody>
                    </table>
                  </div>
                </div>
                </card>
              `
            })
            document.getElementById("data-league").innerHTML = clasementHtml
          })
        }
      })
    }

    fetchApi(base_url + `competitions/${id}/standings`)
    .then(status)
    .then(json)
    .then(data => {
      document.getElementById("league_options_title").innerHTML =  "Klasemen"
      const {name, area} = data.competition;
      
      let leagueHtml = `
        <div class="col m2 s3">
          <img src="src/images/league/${id}.png" class="responsive-img" alt="League Image">
        </div>
        <div class="col m6 s9">
          <table class="white-text league-detail">
            <tr>
              <th>Nama Liga</th>
              <th>: ${name}</th>
            </tr>
            <tr>
              <td>Area</td>
              <td>: ${area.name}</td>
            </tr>
            <tr>
              <td>Tanggal Season</td>
              <td>: ${data.season.startDate} - ${data.season.endDate}</td>
            </tr>
          </table>
        </div>
      `
      document.getElementById('league').innerHTML = leagueHtml;

      let clasementHtml = ""
      data.standings.forEach(function(standing) {
        let {group, type, table} = standing
        if(group === null){
          group = '-'
        }
        clasementHtml += `
        <div class="card">
          <div class="card-title">GRUP: ${group}, TIPE: ${type}</div>
          <div class="divider"></div>
            <div class="card-content">
              <table class="responsive-table centered">
                <thead>
                  <tr>
                      <th>Posisi</th>
                      <th>Logo</th>
                      <th>Nama Club</th>
                      <th>D</th>
                      <th>M</th>
                      <th>S</th>
                      <th>K</th>
                      <th>SG</th>
                      <th>PN</th>
                  </tr>
                </thead>
                <tbody>
        `
        table.forEach(data => {
          const imgUrl = data.team.crestUrl.replace(/^http:\/\//i, 'https://')
          clasementHtml += `
            <tr>
              <td>${data.position}</td>
              <td>
                <a href="/team-detail.html?id=${data.team.id}">
                  <img src="${imgUrl}" class="responsive-img" width="30" alt="${data.team.name}"></td>
                </a>
              <td>
                <a href="./team-detail.html?id=${data.team.id}">
                ${data.team.name}
                </a>
              </td>
              <td>${data.playedGames}</td>
              <td>${data.won}</td>
              <td>${data.draw}</td>
              <td>${data.lost}</td>
              <td>${data.goalDifference}</td>
              <td>${data.points}</td>
            </tr>
          `
          
        });
        clasementHtml += `
                </tbody>
              </table>
            </div>
          </div>
          </card>
        `
      })
      document.getElementById("data-league").innerHTML = clasementHtml
    }).catch(error)
  },
  getTeamDetail: (id) => {
    return new Promise(function(resolve, reject) {
      if('caches' in window) {

        caches.match(base_url + `teams/${id}`).then((response) => {
          if(response) {
            response.json().then((data) => {
              let competitions = ""
              if(data.activeCompetitions.length !== 0){
                for(let i = 0; i < data.activeCompetitions.length-1; i++) {
                  competitions += `${data.activeCompetitions[i].name}, `
                }
                competitions += `${data.activeCompetitions[data.activeCompetitions.length-1].name}.`
              }
              let teamDetailHtml = 
              `
                <div class="col s12 m6">
                  <div class="card">
                    <div class="card-content center">
                      <img id="club_img" src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="" class="responsive-img">
                    </div>
                  </div>
                </div>
                <div class="col m6 s12">
                  <table class="white-text league-detail">
                    <tr>
                      <th>Nama Tim</th>
                      <th>: ${data.name} (${data.shortName})</th>
                    </tr>
                    <tr>
                      <td>Alamat</td>
                      <td>: ${data.address}</td>
                    </tr>
                    <tr>
                      <td>Nomor Telepon</td>
                      <td>: ${data.phone}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>: ${data.email}</td>
                    </tr>
                    <tr>
                      <td>Alamat Web</td>
                      <td>: ${data.website}</td>
                    </tr>
                    <tr>
                      <td>Tahun Berdiri</td>
                      <td>: ${data.founded}</td>
                    </tr>
                    <tr>
                      <td>Kompetisi Aktif</td>
                      <td>: ${competitions}</td>
                    </tr>
                  </table>
                </div>
              `
              document.getElementById('team_detail').innerHTML = teamDetailHtml
              let squadHtml = 
              `
                <table class=" league-detail responsive-table">
                <tr>
                  <th>No. Punggung</th>
                  <th>Nama</th>
                  <th>Posisi</th>
                  <th>Kewarganegaraan</th>
                  <th>Negara Kelahiran</th>
                </tr>
              `
              data.squad.forEach(player => {
                let shirtNum = ""
                if(player.shirtNumber === null) {
                  shirtNum = "-"
                } else {
                  shirtNum = player.shirtNumber
                }
                
                squadHtml += 
                `
                    <tr>
                      <td class="center">${shirtNum}</td>
                      <td>${player.name}</td>
                      <td>${player.position}</td>
                      <td>${player.nationality}</td>
                      <td>${player.countryOfBirth}</td>
                    </tr>
                `
              });
              squadHtml += `</table>`
              document.getElementById('data_squad').innerHTML = squadHtml
              resolve(data)
            })
          }
        })
      }

      fetchApi(base_url + `teams/${id}`)
      .then(status)
      .then(json)
      .then(data => {

        let competitions = ""
        if(data.activeCompetitions.length !== 0){
          for(let i = 0; i < data.activeCompetitions.length-1; i++) {
            competitions += `${data.activeCompetitions[i].name}, `
          }
          competitions += `${data.activeCompetitions[data.activeCompetitions.length-1].name}.`
        }
        let teamDetailHtml = 
        `
          <div class="col s12 m6">
            <div class="card">
              <div class="card-content center">
                <img id="club_img" src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="" class="responsive-img">
              </div>
            </div>
          </div>
          <div class="col m6 s12">
            <table class="white-text league-detail">
              <tr>
                <th>Nama Tim</th>
                <th>: ${data.name} (${data.shortName})</th>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>: ${data.address}</td>
              </tr>
              <tr>
                <td>Nomor Telepon</td>
                <td>: ${data.phone}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>: ${data.email}</td>
              </tr>
              <tr>
                <td>Alamat Web</td>
                <td>: ${data.website}</td>
              </tr>
              <tr>
                <td>Tahun Berdiri</td>
                <td>: ${data.founded}</td>
              </tr>
              <tr>
                <td>Kompetisi Aktif</td>
                <td>: ${competitions}</td>
              </tr>
            </table>
          </div>
        `
        document.getElementById('team_detail').innerHTML = teamDetailHtml
        let squadHtml = 
        `
          <table class=" league-detail responsive-table">
          <tr>
            <th>No. Punggung</th>
            <th>Nama</th>
            <th>Posisi</th>
            <th>Kewarganegaraan</th>
            <th>Negara Kelahiran</th>
          </tr>
        `
        data.squad.forEach(player => {
          let shirtNum = ""
          if(player.shirtNumber === null) {
            shirtNum = "-"
          } else {
            shirtNum = player.shirtNumber
          }
          
          squadHtml += 
          `
              <tr>
                <td class="center">${shirtNum}</td>
                <td>${player.name}</td>
                <td>${player.position}</td>
                <td>${player.nationality}</td>
                <td>${player.countryOfBirth}</td>
              </tr>
          `
        });
        squadHtml += `</table>`
        document.getElementById('data_squad').innerHTML = squadHtml
        resolve(data)
      })
      .catch(error)
    })
  },
  getSavedTeamById: () => {
    const urlParams = new URLSearchParams(window.location.search)
    const idParam = urlParams.get("id")
    
    db.getById(idParam).then(data => {

      let competitions = ""
      if(data.activeCompetitions.length !== 0){
        for(let i = 0; i < data.activeCompetitions.length-1; i++) {
          competitions += `${data.activeCompetitions[i].name}, `
        }
        competitions += `${data.activeCompetitions[data.activeCompetitions.length-1].name}.`
      }
      let teamDetailHtml = 
      `
        <div class="col s12 m6">
          <div class="card">
            <div class="card-content center">
              <img id="club_img" src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="" class="responsive-img">
            </div>
          </div>
        </div>
        <div class="col m6 s12">
          <table class="white-text league-detail">
            <tr>
              <th>Nama Tim</th>
              <th>: ${data.name} (${data.shortName})</th>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>: ${data.address}</td>
            </tr>
            <tr>
              <td>Nomor Telepon</td>
              <td>: ${data.phone}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>: ${data.email}</td>
            </tr>
            <tr>
              <td>Alamat Web</td>
              <td>: ${data.website}</td>
            </tr>
            <tr>
              <td>Tahun Berdiri</td>
              <td>: ${data.founded}</td>
            </tr>
            <tr>
              <td>Kompetisi Aktif</td>
              <td>: ${competitions}</td>
            </tr>
          </table>
        </div>
      `
      document.getElementById('team_detail').innerHTML = teamDetailHtml
      let squadHtml = 
      `
        <table class=" league-detail responsive-table">
        <tr>
          <th>No. Punggung</th>
          <th>Nama</th>
          <th>Posisi</th>
          <th>Kewarganegaraan</th>
          <th>Negara Kelahiran</th>
        </tr>
      `
      data.squad.forEach(player => {
        let shirtNum = ""
        if(player.shirtNumber === null) {
          shirtNum = "-"
        } else {
          shirtNum = player.shirtNumber
        }
        
        squadHtml += 
        `
            <tr>
              <td class="center">${shirtNum}</td>
              <td>${player.name}</td>
              <td>${player.position}</td>
              <td>${player.nationality}</td>
              <td>${player.countryOfBirth}</td>
            </tr>
        `
      });
      squadHtml += `</table>`
      document.getElementById('data_squad').innerHTML = squadHtml
    

        
    })
  },
  getSavedTeams: () => {
    db.getAllTeam()
      .then(teams => {
        let teamsHtml = ""
        if(teams.length === 0) {
          teamsHtml += 
          `
          <div class="col m12">
            <h5 class="center orange-text">Tidak ada data tersimpan.</h5>
          </div>
          `
          
        }
        teams.forEach(team => {
          teamsHtml += 
          `
            <div class="col m6 l4 s12">
              <div class="card saved-item">
                <div class="card-content saved-card-content">
                  <span><a href="team-detail.html?id=${team.id}&saved=true"><img width="50" height="50" src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" class="valign-wrapper"></a></span>
                  <div class="content">
                    <span class="team-name grey-text text-darken-4 valign-wrapper"><a href="team-detail.html?id=${team.id}&saved=true">${team.name}</a></span>
                  </div>
                  <span class="delete-button" id="${team.id}">✖</span>
                </div>
              </div>
            </div>
          `
        });
        document.getElementById("savedTeams").innerHTML = teamsHtml
        
       setEventSavedTeam()
      })
  }, 
  getSavedMatches: () => {
    db.getAllMatches()
      .then(matches => {
        let matchesHtml = ""

        if(matches.length === 0) {
          matchesHtml += 
          `
          <div class="col m12">
            <h5 class="center orange-text">Tidak ada data tersimpan.</h5>
          </div>
          `
          document.getElementById("savedMatches").innerHTML = matchesHtml
          
        } else {
          matches.forEach(match => {
            let {id, homeTeam, awayTeam, utcDate} = match
            matchesHtml += 
            `
            <div class="col s12 m6">
            <div class="card">
              <h6 class="center header col s12">
                ${utcDate}
              </h6>
              <div class="card-content">
                <div class="team left">
                  
                  <p class="center">${homeTeam.name}</p>
                </div>
                <div class="center">
                  <h5>VS</h5>
                </div>
                <div class="team right">
                  <p class="center">${awayTeam.name}</p>
                </div>
              </div>
              <span class=" delete-match-button" id="${id}">✖</span>
            </div>
          </div>
            `
          });
          document.getElementById("savedMatches").innerHTML = matchesHtml
          return(matches)
        }
       
      }).then(() => {
        let btnList = document.getElementsByClassName('delete-match-button')

        for(let i = 0; i < btnList.length; i++) {
          btnList[i].addEventListener('click', () => {
            db.deleteMatch(btnList[i].id)
            api.getSavedMatches()
          })
        }
      })

  }
}
function setEventSavedTeam() {
  let btnList = document.getElementsByClassName('delete-button')
    for(let i = 0; i< btnList.length; i++) {
      btnList[i].addEventListener('click', () => {
        db.deleteTeam(btnList[i].id)
        api.getSavedTeams()
      })
    }
}


export default api;