let parsedStates = [];
let clickedState;

window.onload = async function () {
    let states = await inviaRichiesta("GET", "/api/elenco");  // Otterrà direttamente l'array degli oggetti JSON
    let lstRegioni = $("#lstRegioni");

    if (states) {
        // Popola la lista delle regioni
        states.forEach(singleState => {
            parsedStates.push(singleState);
            // Aggiungi ogni opzione alla lista <select> con il valore univoco della regione
            $("<option>")
                .val(singleState.name)
                .text(`${singleState.name} [${singleState.stationcount} emittenti]`)
                .appendTo(lstRegioni);
        });

        // Usa l'evento 'change' per ottenere la selezione dell'utente
        lstRegioni.on("change", async function () {
            // Ottieni il valore della regione selezionata
            clickedState = $(this).val();  
            console.log("Regione selezionata:", clickedState);
        });
        let radios = await inviaRichiesta("POST", "/api/radios", {"state" : clickedState})
        if(radios)
            console.log('Web radio ricevute : ' + radios.name)
    }
};
