$(document).ready(function () {
    divFilters = $(".card").eq(0);
    divDettagli = $("#divDettagli"); // Inizializza divDettagli

    let divCollections = $("#divCollections");

    btnAdd = $("#btnAdd"); // Inizializza btnAdd
    btnAdd.prop("disabled", true);

    divFilters.hide();
    $("#lstHair").prop("selectedIndex", -1);

    if (btnAdd.length === 0) {
        console.error("Elemento #btnAdd non trovato nel DOM");
        return;
    }

    if (divCollections.length === 0) {
        console.error("#divCollections non trovato nel DOM");
        return;
    }

    getCollections();

    $("#btnFind").on("click", function () {
        console.log("Find");
        let hair = $("#lstHair").val();
        let gender = "";
        if ($("#chkMale").is(":checked") && $("#chkFemale").is(":checked")) {
            gender = "both";
        } else if ($("#chkFemale").is(":checked")) {
            gender = "f";
        } else if ($("#chkMale").is(":checked")) {
            gender = "m";
        }

        let filters = {};

        if (hair) {
            filters["hair"] = hair.toLowerCase();
        }

        if (gender) {
            filters["gender"] = gender.toLowerCase();
        }

        getDataCollections(filters);
    });

    $("#btnAdd").on("click", function () {
        divDettagli.empty(); // Svuota divDettagli
        let textarea = $("<textarea>")
            .attr("rows", 10)
            .attr("cols", 50)
            .prop("placeholder", '{"Name" : "Pippo"}');
        textarea.appendTo(divDettagli); // Aggiungi la textarea a divDettagli

        $("<button>")
            .appendTo(divDettagli)
            .text("Aggiungi")
            .addClass("btn btn-success btn-sm")
            .on("click", async function () {
                let record = divDettagli.children("textarea").val();
                try {
                    record = JSON.parse(record);
                    const result = await inviaRichiesta("POST", `/api/${currentCollection}`, record);
                    console.log(result);
                    getDataCollections(); // Aggiorna i dati
                } catch (error) {
                    alert("Json non valido\n " + error.message);
                }
            });
    });
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
async function getDataCollections(filter = {}) {
    console.log(currentCollection);
    const data = await inviaRichiesta("GET", `/api/${currentCollection}`, filter);
    if (data) {
        console.log(data);

        let divIntestazione = $("#divIntestazione");
        divIntestazione.find("strong").eq(0).text(currentCollection);
        divIntestazione.find("strong").eq(1).text(data.length);

        tbody = $("#tbody");
        tbody.empty();

        data.forEach((element) => {
            let tr = $("<tr>");
            $("<td>").text(element._id).appendTo(tr).on("click", function () {
                getDetails($(this).text());
            });

            let secondKey = Object.keys(element)[1];
            $("<td>").text(element[secondKey]).appendTo(tr).on("click", function () {
                getDetails($(this).text());
            });

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

            tr.appendTo(tbody);
        });

        if (currentCollection === "Unicorns") {
            divFilters.show();
        } else {
            divFilters.hide();
            divFilters.find("input:checkbox").prop("checked", false);
            $("#lstHair").prop("selectedIndex", -1);
        }
    }
}
