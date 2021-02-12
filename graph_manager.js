function plot() {
    Plotly.d3.csv("data.csv", function (error, arrayOggetti) {
        if (error) {
            console.error(arrayOggetti);
            document.getElementById("redesign").innerHTML = "Cannot load data!";
            return;
        }
        /*
        console.log(arrayOggetti);
        arrayOggetti.sort(function (a, b) {
            return b.field - a.field;
        });
        console.log(arrayOggetti);
        */
        let tema = document.getElementById("tema");

        let oggettoFieldsData = fromObjectsArrayToFieldsData(arrayOggetti);
        let fields = oggettoFieldsData["fields"];
        let colonne = [];
        for (let nomeColonna of fields) {
            colonne[nomeColonna] = getColumnFromFieldsData(oggettoFieldsData, nomeColonna);
        }
        console.log(colonne);

        let formValue = document.getElementById("form")["valoreSelect"].value;
        console.log(formValue);
        let testoReattivo = {
            titolo: "I maggiori incrementi in % di disoccupati in America",
            titolox : "Percentuale di Americani che hanno perso il lavoro nel mese di picco",
            xsuffix: "%"
        }
        if (formValue === "Assoluto") {
            testoReattivo.titolo = "I maggiori incrementi di disoccupati in America";
            testoReattivo.titolox = "Americani che hanno perso il lavoro nel mese di picco";
            testoReattivo.xsuffix = "M";
        }

        //ANNOTAZIONI

        let annotazioni = [];
        let num = colonne[formValue].length;
        for(let i=0; i<num-1; i++) {
            annotazioni.push({
                x: colonne[formValue][i],
                y: colonne["Anno"][i],
                text: " "+colonne["Nome"][i],
                xanchor:'left',
                showarrow:false,
                font: {family: "Raleway, Helvetica, sans-serif", color:'black', size: 18},
                bgcolor: 'white', opacity: 1
            });
        }
        annotazioni.push({
            x: colonne[formValue][num-1],
            y: colonne["Anno"][num-1],
            text: colonne["Nome"][num-1]+" ",
            xanchor:'right',
            showarrow:false,
            font: {family: "Raleway, Helvetica, sans-serif", color:'white', size: 18}
        });

        for(let i=0; i<num; i++) {
            annotazioni.push({
                x: 0,
                y: colonne["Anno"][i],
                text: " "+colonne[formValue][i]+testoReattivo.xsuffix+"",
                xanchor:'left',
                showarrow:false,
                font: {family: "Raleway, Helvetica, sans-serif", color:'white', size: 15}
            });
        }

        if (tema && tema.href.includes('dark')) {
            for(let i=0; i<num-1; i++) {
                annotazioni[i].font.color = "lightgray";
                annotazioni[i].bgcolor = '404040';
            }
        }
        annotazioni[num-1].font.color = 'white';
        annotazioni[num-1].bgcolor = '';

        console.log(annotazioni);

        // TRACCE

        let track = {
                y : colonne["Anno"], x : colonne[formValue], text : colonne["Nome"],
                font: {color: "lightgray"},
                orientation: "h", type : "bar",
                hoverinfo: "y+x",
                marker : {color:getColori(num), line : {color: "lightgray", width:0.5}}}

        Plotly.newPlot("grafico1", [track], getLayout(testoReattivo, annotazioni), {responsive: true});
    });
}

/**
 *Funzione che fornisce il layout in base al tema
 */
function getLayout(reattivo, annotazioni) {
    let tema = document.getElementById("tema");
    let titolo = reattivo.titolo;
    let margin = {l: 80, r: 5, b: 45, t: 50};
    let layout = {
            paper_bgcolor: 'white', plot_bgcolor: "white", //'#eeeeee',
            title: {
                text: titolo,
                font: {family: "Raleway, Helvetica, sans-serif", size: 28, color: "black"},
                x: 0.01, y: 0.977},
            margin: margin,
            xaxis: {
                title: reattivo.titolox, titlefont: {color: "black"},
                gridcolor: "lightgray", gridwidth: 0.05,
                showticklabels: true, tickangle: 0,
                tickfont: {color: 'black'}, ticksuffix: reattivo.xsuffix},
            yaxis: {
                title: {text: "", standoff: 20}, titlefont: {color: "black"},
                linecolor: 'lightgray', linewidth: 0.05,
                showticklabels: true, tickangle: 0,
                tickfont: {color: 'black'}, tickprefix:"Anno ", showtickprefix:"last", ticksuffix: " ", showticksuffix: "all",
                type:'category', autorange:'reversed'},
            annotations : annotazioni}

    if (tema && tema.href.includes("dark")) {
        layout.paper_bgcolor = "#404040";
        layout.plot_bgcolor = '#404040';
        layout.title.font.color = "lightgray";
        layout.xaxis.titlefont.color = "lightgray";
        layout.xaxis.tickfont.color = "lightgray";
        layout.yaxis.titlefont.color = "lightgray";
        layout.yaxis.tickfont.color = "lightgray";
    }
    return layout;
}

//Funzioni di utilità scritte per le esercitazioni

/**
 *Funzione che restituisce un array di colori in base al tema
 */
function getColori(n) {
    let tema = document.getElementById("tema");
    let colori = [];
    if (tema && tema.href.includes('dark')){
        for (let i = 0; i<n-1 ; i++)
            colori.push("rgba(55,128,191,1)");
        colori.push("orangered");
    }
    else {
        for (let i = 0; i<n-1 ; i++)
            colori.push("rgba(55,128,191,0.9)");
        colori.push("rgba(255,153,51,0.9)");
    }
    return colori;
}


/**
 * Restituisce i valori di una colonna da un oggetto JS nel formato indicato
 * @param oggettoJson oggetto di array nel formato {fields[], data[]}
 * @param x vettore che riceve per riferimento le ascisse
 * @param y vettore che riceve per riferimento le ordinate
 */
function getColumnFromFieldsData(oggettoFieldsData , campo) {
    let arrayOggetti = fromFieldsDataToObjectsArray(oggettoFieldsData);
    let colonna = [];
    for (let oggetto of arrayOggetti) {
        colonna.push(oggetto[campo]);
    }
    console.log(colonna);
    return colonna;
}

/**
 * Trasforma un oggetto dal formato {fields[], data[]}
 * al formato [oggetti_Js{}]
 * @param {fields[], data[]}
 * @returns [oggetti_Js{}]
 */
function fromFieldsDataToObjectsArray(oggettoFieldsData) {
    //console.log(oggettoFieldsData)
    let fields = oggettoFieldsData.fields;
    let data = oggettoFieldsData.data; //eventualmente da modificare
    let arrayOggetti = [];
    for (let riga of data) {
        let oggetto = {};
        let cnt = 0;
        for (let campo of fields) {
            oggetto[campo] = riga[cnt++];
        }
        arrayOggetti.push(oggetto);
    }
    console.log(arrayOggetti);
    return arrayOggetti;
}

/**
 * Trasforma un oggetto dal formato [oggetti_Js{}]
 * al formato {fields[], data[]}
 * @param [oggetti_Js{}]
 * @returns {fields[], data[]}
 */
function fromObjectsArrayToFieldsData(arrayOggetti) {
    //console.log(arrayOggetti);
    let fields = getPropertiesFromArrayOrObjects(arrayOggetti[0]);
    let oggettoFieldsData = {};
    oggettoFieldsData["fields"] = fields;
    let data = [];
    for (let oggetto of arrayOggetti) { //Per ogni riga
        data.push(getValuesFromArrayOrObjects(oggetto));
    }
    //console.log(data);
    oggettoFieldsData["data"] = data;
    console.log(oggettoFieldsData)
    return oggettoFieldsData;
}

/**
 * Funzione di basso livello per trovare le proprietà
 * @param oggetto Array associativo o oggetto
 * @returns {[]} array delle proprietà dell'oggeto originario
 */
function getPropertiesFromArrayOrObjects(oggetto) {
    let properties = [];
    for (let prop in oggetto) {
        properties.push(prop);
    }
    return properties;
}

/**
 * Funzione di basso livello per trovare i valori
 * @param oggetto Array associativo o oggetto
 * @returns {[]} array dei valori dell'oggeto originario
 */
function getValuesFromArrayOrObjects(oggetto) {
    let values = [];
    for (let value in oggetto) {
        values.push(oggetto[value]);
    }
    return values;
}