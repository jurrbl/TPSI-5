"use strict"
$(document).ready(function() {
	
	let div = $("div")

    $("#btnGet").on("click", async function() {
        let data = await inviaRichiesta("GET", "/api/risorsa1", { "nome": "Aurora" });
		console.log(data)
        if(data) {
		   div.text(JSON.stringify(data))
        }
    });

    $("#btnPost").on("click", async function() {
        let data = await inviaRichiesta("PATCH", "/api/risorsa2", {"nome": "Unico", "nVampiri": 3});
        if(data) {
           div.empty()
		   div.text(JSON.stringify(data))
        }
    });

    $("#btnParams").on("click", async function() {
		// Richiedi gli unicorni di genere maschile e pelo grigio
        let data = await inviaRichiesta("GET", "/api/richiestaParams/m/brown"); //passaggio di parametri NON in URL Encoded
        if(data) {
           div.empty()
		   for(let item of data) 
			 $("<div>").text(JSON.stringify(item)).appendTo(div)
        }
    });

});