// TEMA

/**
 * Setta il tema scuro se è presente il tema chiaro e viceversa.
 */
function switchTema() {
    let tema = document.getElementById("tema");
    let photos = document.getElementsByTagName("img");
    let logoPoli = photos.item(photos.length-1);
    if (tema.href.includes('light')) {
        tema.href = 'CSS/dark_theme.css';
        logoPoli.src = "IMG/PoliTO_logo_dark.png";
        aggiornaBottoneTemaChiaro();
        document.cookie = 'tema=scuro';
    }
    else if (tema.href.includes('dark')){
        tema.href = "CSS/light_theme.css";
        logoPoli.src = "IMG/PoliTO_logo_light.png";
        aggiornaBottoneTemaScuro();
        document.cookie = 'tema=chiaro';
    }
    plot();
}

/**
 * Mostra un'anteprima del tema che si sta per selezionare quando si è :hover su #navigation
 */
function anteprimaTema() {
    let tema = document.getElementById("tema");
    if (tema.href.includes('light')) {
        aggiornaBottoneTemaScuro();
        return;
    }
    if (tema.href.includes('dark')){
        aggiornaBottoneTemaChiaro();
        return;
    }
}

/**
 * Funzione di basso livello che mostra un'anteprima del tema scuro nel bottone
 */
function aggiornaBottoneTemaScuro() {
    // childNodes[1] perché [0] e [2] sono campi text generici del div!
    // oppure meglio children[0]
    let bottone = document.getElementById("selectTema");
    bottone.children[0].innerText = ">Scuro";
    bottone.style.backgroundColor = "#404040";
    bottone.children[0].style.color = "lightgray";
}

/**
 * Funzione di basso livello che mostra un'anteprima del tema chiaro nel bottone
 */
function aggiornaBottoneTemaChiaro() {
    let bottone = document.getElementById("selectTema");
    bottone.children[0].innerText = ">Chiaro";
    bottone.style.backgroundColor = "white";
    bottone.children[0].style.color = "black";
}

/**
 * Fa tornare #navigation allo stato di default quando il mouse si sposta
 */
function resetTema() {
    let bottone = document.getElementById("selectTema");
    bottone.children[0].innerText = "Tema";
    bottone.style.backgroundColor = "";
    bottone.children[0].style.color = "";
}

// NAV

/**
 * Funzione di basso livello che setta il tipo di display dei .nav (no #navigation)
 * @param tipoDisplay (none, block...)
 */
function setDisplayNav(tipoDisplay) {
    let nav = document.getElementsByClassName("nav");
    for (let i = 1; i < nav.length; i++) {
        nav.item(i).style.display = tipoDisplay;
    }
}

/**
 * Mostra tutti i .nav eccetto #navigation
 */
function showNav() {
    let nav = document.getElementsByClassName("nav");
    // Voglio modificare il display di tutti, eccetto #navigation (il menu)
    setDisplayNav("block");
    nav.item(0).classList.add("activeNavigator");
}

/**
 * Nasconde tutti i .nav eccetto #navigation
 */
function hideNav() {
    let nav = document.getElementsByClassName("nav");
    setDisplayNav("");
    nav.item(0).classList.remove("activeNavigator");
}

/**
 * Funzione di più alto livello che gestisce i .nav a seconda dello stato attuale
 */
function handleNav() {
    let indicatore = document.getElementsByClassName("nav").item(1).style.display;
    if (indicatore === "block") {
        hideNav();
        resetTema();
    }
    else {
        showNav();
        anteprimaTema();
    }
}
/**
 * Quando nascondo i .nav con #navigation e poi faccio zoom-out rimangono nascosti,
 * questo corregge ogni volta che la viewport viene "resized"
 */
function correctNav() {
    if (window.innerWidth > 600) {
        resetTema();
        showNav();
    }
    else
        hideNav();
}

/**
 * Quando la viewport è in mobile, nasconde i nav
 */
function closeNavAfterClick() {
    if (window.innerWidth <= 600) {
        hideNav();
    }
}

/**
 *Dà a tutti i .nav (eccetto #navigation) come proprietà onclick
 *la funzione nascondere i nav quando la viewport è in mobile.
 */
function onloadNavAttribute() {
    let nav = document.getElementsByClassName("nav");
    for (let i = 1; i < nav.length; i++) {
        nav.item(i).setAttribute('onclick', "closeNavAfterClick()");
    }
}

/**
 *Quando la pagina è carica, esegue operazioni di automazione
 */
window.onload = function () {
    onloadNavAttribute();
    plot();
}

/**
 * Funzione da chiamare nell'head per impostare il tema a seconda dei cookie;
 */
function caricaTemaEsatto() {
    if (leggiCookie("tema") === "scuro") {
        document.writeln("<link id=\"tema\" rel=\"stylesheet\" type=\"text/css\" href=\"CSS/dark_theme.css\" media=\"screen\">");
    }
    else
        document.writeln("<link id=\"tema\" rel=\"stylesheet\" type=\"text/css\" href=\"CSS/light_theme.css\" media=\"screen\">");
}

function caricaLogoPoliEsatto() {
    if (leggiCookie("tema") === "scuro") {
        document.writeln("<img src = \"IMG/PoliTO_logo_dark.png\" alt = \"Politecnico di Torino\">");
    }
    else
        document.writeln("<img src = \"IMG/PoliTO_logo_light.png\" alt = \"Politecnico di Torino\">");
}

/**
 * Funzione che si occupa di parsificare i cookie;
 * E' abbastanza banale e facilmente riscrivibile, ma visto che non l'ho scritta personalmente,
 * per dovere di cronaca allego il suo URL di origine:
 * "//www.mrwebmaster.it/javascript/creare-leggere-cancellare-cookie-javascript_7448.html"
 */
function leggiCookie(nomeCookie)
{
    if (document.cookie.length > 0)
    {
        var inizio = document.cookie.indexOf(nomeCookie + "=");
        if (inizio != -1)
        {
            inizio = inizio + nomeCookie.length + 1;
            var fine = document.cookie.indexOf(";",inizio);
            if (fine == -1) fine = document.cookie.length;
            return unescape(document.cookie.substring(inizio,fine));
        }else{
            return "";
        }
    }
    return "";
}