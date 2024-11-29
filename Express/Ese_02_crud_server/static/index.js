"use strict";

let currentCollection = ""; // Variabile globale
let btnAdd; // Variabile globale per il pulsante

$(document).ready(function() {
    let divIntestazione = $("#divIntestazione");
    let divFilters = $(".card").eq(0);
    let divCollections = $("#divCollections");
    let table = $("#mainTable");
    let divDettagli = $("#divDettagli");

    btnAdd = $("#btnAdd"); // Inizializza btnAdd

    divFilters.hide();
    $("#lstHair").prop("selectedIndex", -1);

    // Verifica che btnAdd esista
    if (btnAdd.length === 0) {
        console.error("Elemento #btnAdd non trovato nel DOM");
        return;
    }

    if (divCollections.length === 0) {
        console.error("#divCollections non trovato nel DOM");
        return;
    }
    
    getCollections();
});

async function getCollections() {
    const data = await inviaRichiesta("GET", "/api/getCollections");
    if (data) {
        console.log(data);

        const divCollections = $("#divCollections");
        const label = divCollections.children('label');

        data.forEach(element => {
            const clonedLabel = label.clone().appendTo(divCollections);
            clonedLabel.children('span').text(element.name);
            clonedLabel.children('input').val(element.name).on("click", function() {
                currentCollection = $(this).val(); // Modifica currentCollection
                btnAdd.prop('disabled', false); // Abilita il pulsante
                getDataCollections();
            });
        });
        label.remove();
    }
}

async function getDataCollections() {
    const data = await inviaRichiesta("GET", `/api/${currentCollection}`);
    if (data) {
        console.log(data);
        let divIntestazione = $("#divIntestazione");
        divIntestazione.find('strong').eq(0).text(currentCollection);
        divIntestazione.find('strong').eq(1).text(data.length);
    }
}
