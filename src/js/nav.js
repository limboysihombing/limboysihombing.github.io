import view from './view.js'

const nav = {
  loadNav : () => {
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);

    let page = window.location.hash.substr(1);
    if (page == "") page = "home";

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;
    
        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });
    
        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
          elm.addEventListener("click", function(event) {
            // Tutup sidenav
            let sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();
    
            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute("href").substr(1);
            view.loadPage(page);
          });
        });
      }
    };
    xhttp.open("GET", "/src/components/nav.html", true);
    xhttp.send();

    view.loadPage(page)
  },
}

export default nav;