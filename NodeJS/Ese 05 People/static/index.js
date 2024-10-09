let currentCountry; // nazione attualmente selezionata
let people; // vettore enumerativo delle Persone attualmente visualizzate
let currentPos; // Posizione del dettaglio corrente (rispetto al vettore enumerativo people)
let vectNations = [];

window.onload= async function () {
	let _lstNazioni = $("#lstNazioni");
	let _tabStudenti = $("#tabStudenti");
	let _divDettagli = $("#divDettagli");
	let _dropdownButton = $("#dropdownMenuButton");
	_divDettagli.hide();

	let countries  = await inviaRichiesta("GET", "/api/country");
	if(countries)
	{
		console.log(countries)
		countries.forEach(nations => {
			$("<a>").addClass("dropdown-item").prop('href', '#').text(nations).appendTo(_lstNazioni)
			.on("click", function(){
				let currentCountry = $(this).text();
				_dropdownButton.text(currentCountry)
				sendPeopleRequest(currentCountry)
			})
	
		});
	}

};


async function sendPeopleRequest(clickedNation) { // Crea l'URL con il parametro 'country' in modo corretto
	console.log(clickedNation)
	let people = await inviaRichiesta("GET", "/api/people", {'country' : clickedNation})
	if(people)
		console.log(people);
}
