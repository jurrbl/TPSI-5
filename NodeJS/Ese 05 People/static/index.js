let currentCountry; // nazione attualmente selezionata
let people; // vettore enumerativo delle Persone attualmente visualizzate
let currentPos; // Posizione del dettaglio corrente (rispetto al vettore enumerativo people)
let vectNations = [];

$(document).ready(function () {
	let _lstNazioni = $("#lstNazioni");
	let _tabStudenti = $("#tabStudenti");
	let _divDettagli = $("#divDettagli");
	let _dropdownButton = $("#dropdownMenuButton");
	_divDettagli.hide();

	let rq = inviaRichiesta("GET", "/countries");
	rq.then(function (response) {
		let nations = response.results;
		vectNations = [];
		nations.forEach(user => {
			let countryName = user.location.country;
			vectNations.push(countryName);
		});

		// Usa un Set per rimuovere i duplicati e poi crea un array ordinato
		let sortedNations = [...new Set(vectNations)].sort();

		


		sortedNations.forEach(singleNation => {
			let option = $("<a></a>");
			option.text(singleNation);
			option.val(singleNation);
			option.addClass("dropdown-item")
            option.click(function() {
                currentCountry = singleNation;
                _dropdownButton.text(currentCountry);
                sendPeopleRequest(currentCountry);
            });
			
            _lstNazioni.append(option);
		});

		


	}).catch(function (error) {
		console.error("Errore nella richiesta:", error);
	});
});


function sendPeopleRequest(clickedNation) {
    let rq = inviaRichiesta("GET", "/people", { country: clickedNation });
    
    rq.then(function(response)
{
    console.log(response)
})
}
