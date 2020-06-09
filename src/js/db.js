let dbPromised = idb.open("football-info", 1, function(upgradeDb) {
  let teamObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: 'id'
  });
  teamObjectStore.createIndex("team_name", "name", { unique: false });

  let matchesObjectStore = upgradeDb.createObjectStore("matches", {
    keyPath: 'id'
  });
  matchesObjectStore.createIndex("utcDate", "utcDate", { unique: false });
});

const db = {
  saveTeam: (team) =>{
    dbPromised
      .then(db => {
        let tx = db.transaction("teams", "readwrite")
        let store = tx.objectStore("teams")
        store.put(team) 
        return tx.complete;
      })
      .then(() => {
        M.toast({html: 'Tim berhasil di simpan', classes: 'rounded teal accent-3'})
      }).catch(err => {
        M.toast({html: 'Tim sudah disimpan', classes: 'rounded orange darken-4'})
      })
      
  }, 
  deleteTeam: (id) => {
    dbPromised.then(function(db) {
      let tx = db.transaction('teams', 'readwrite');
      let store = tx.objectStore('teams');
      store.delete(parseInt(id));
      return tx.complete;
    }).then(function() {
      M.toast({html: 'Tim berhasil dihapus', classes: 'rounded teal accent-3'})
    });
  },
  getAllTeam: () => {
    return new Promise((resolve, reject) => {
      dbPromised
        .then(db => {
          const tx = db.transaction("teams", "readonly");
          const store = tx.objectStore("teams");
          return store.getAll();
        })
        .then( team => {
          resolve(team)
        })
    })
  },
  getById: (id) =>{
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(function(db) {
          let tx = db.transaction("teams", "readonly");
          let store = tx.objectStore("teams");
          return store.get(parseInt(id));
        })
        .then(function(team) {
          resolve(team);
        });
    });
  },
  checkDataExists: (id, storeName) => {
    return new Promise((resolve, reject) => {
      dbPromised.then(db => {
        let tx = db.transaction(storeName, "readonly");
        let store = tx.objectStore(storeName)
        return store.get(parseInt(id)) 

      }).then(obj => {
        if(obj !== undefined) {
          resolve(1)
        } else {
          resolve(0)
        }
      })
  

    })
  },
  saveMatch: (match) =>{
    dbPromised
      .then(db => {
        let tx = db.transaction("matches", "readwrite")
        let store = tx.objectStore("matches")
        store.put(match) 
        return tx.complete;
      })
      .then(() => {
        M.toast({html: 'Pertandingan berhasil di simpan', classes: 'rounded teal accent-3'})
      }).catch(err => {
        console.log(err)
        M.toast({html: 'Pertandingan sudah disimpan', classes: 'rounded orange darken-4'})
      })
  }, 
  getAllMatches: () => {
    return new Promise((resolve, reject) => {
      dbPromised
        .then(db => {
          const tx = db.transaction("matches", "readonly");
          const store = tx.objectStore("matches");
          return store.getAll();
        })
        .then( matches => {
          resolve(matches)
        })
    })
  },
  deleteMatch: (id) => {
    dbPromised.then(function(db) {
      let tx = db.transaction('matches', 'readwrite');
      let store = tx.objectStore('matches');
      store.delete(parseInt(id));
      return tx.complete;
    }).then(function() {
      M.toast({html: 'Pertandingan berhasil dihapus', classes: 'rounded teal accent-3'})
    });
  },
}

export default db