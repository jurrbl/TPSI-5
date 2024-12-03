"use strict";

let currentCollection = ""; // Variabile globale
let btnAdd; // Variabile globale per il pulsante
let table = $("#mainTable");
let tbody;
let divFilters;

$(document).ready(function () {
    divFilters = $(".card").eq(0);
    let divCollections = $("#divCollections");
    // let divDettagli = $("#divDettagli");

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


    
$("#btnFind").on("click", function() {
    console.log("Find");
    let hair =  $("#lstHair").val();
    let gender = "";
    if ($("#chkMale").is(":checked") && $("#chkFemale").is(":checked")) {
        gender = "both";
    } else if ($("#chkFemale").is(":checked")) {
        gender = "f";
    } else if ($("#chkMale").is(":checked")) {
        gender = "m";
    }

    let filters = {}

    if(hair)
    {
        filters["hair"] = hair.toLowerCase();
    }

    if(gender)
    {
        filters["gender"] = gender.toLowerCase();
    }

    getDataCollections(filters);
})

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
            clonedLabel.children('input').val(element.name).on("click", function () {
                currentCollection = $(this).val(); // Modifica currentCollection
                btnAdd.prop('disabled', false); // Abilita il pulsante
                getDataCollections();
            });
        });
        label.remove();
    }
}

async function getDataCollections(filter={}) {
    console.log(currentCollection);
    const data = await inviaRichiesta("GET", `/api/${currentCollection}`, filter);
    if (data) {
        console.log(data);

        // Aggiorna i dati nell'intestazione
        let divIntestazione = $("#divIntestazione");
        divIntestazione.find('strong').eq(0).text(currentCollection);
        divIntestazione.find('strong').eq(1).text(data.length);

        tbody = $("#tbody");
        tbody.empty();

        // Popola la tabella
        data.forEach(element => {
            let tr = $("<tr>"); // Crea una nuova riga
            $("<td>").text(element._id).appendTo(tr).on("click", function () {
                getDetails($(this).text());
            });

            // Aggiungi la seconda chiave dinamicamente
            let secondKey = Object.keys(element)[1]; // Prende la seconda chiave
            $("<td>").text(element[secondKey]).appendTo(tr).on("click", function()
            {
                getDetails($(this).text());
            })

            let td = $("<td>");
            for (let i = 1; i <= 3; i++) {
                let div = $("<div>");
                switch (i) {
                    case 1:
                        div.css("background-position", "-64px -112px").on("click", function () {
                            getDetails(element._id);
                        });
                        break;
                    case 2:
                        div.css("background-position", "-240px -96px");
                        break;
                    case 3:
                        div.css("background-position", "-176px -96px");
                        break;
                }
                div.appendTo(td);
            }
            td.appendTo(tr);

            tr.appendTo(tbody); // Aggiungi la riga al tbody
        });

        // Mostra o nascondi i filtri in base alla collezione
        if (currentCollection === "Unicorns") {
            divFilters.show();
        } else {
            divFilters.hide();
            divFilters.find("input:checkbox").prop("checked", false);
            $("#lstHair").prop("selectedIndex", -1);
        }
    }
}


async function getDetails(id) {
    console.log(id);
    const data = await inviaRichiesta("GET", `/api/${currentCollection}/${id}`);
    console.log(data);

    const divDettagli = $("#divDettagli");
    divDettagli.empty(); // Svuota il divDettagli

    const sortedKeys = Object.keys(data).sort();
    sortedKeys.forEach(key => {
        let strong = $("<strong>").text(key + ": ");
        strong.appendTo(divDettagli);
        let span = $("<span>").text(data[key]);
        span.appendTo(divDettagli);
        $("<br>").appendTo(divDettagli);
    });
}
