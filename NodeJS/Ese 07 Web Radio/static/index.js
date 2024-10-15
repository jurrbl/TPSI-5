let parsedStates = [];
let clickedState;
let idLike;


window.onload = function () {

	GET_STATES()
};

async function GET_STATES() {
	let lstRegioni = $("#lstRegioni");
	let states = await inviaRichiesta("GET", "/api/elenco")

	if (states) 
		states.forEach(STATE => {
			$("<option>").val(STATE.name).text(`${
				STATE.name
			} [${
				STATE.stationcount
			} emittenti]`).appendTo(lstRegioni);
		});
	

	lstRegioni.on("change", function () {
		let selectedState = $(this).val();
		GET_BODYRADIO(selectedState)

	})
}
async function GET_BODYRADIO(statoSelezionato) {
	let table = $("#tbody");
	table.empty();
	console.log(statoSelezionato);
	let radios = await inviaRichiesta("POST", "/api/radios", { statoSelezionato });
	if (radios) {
		radios.forEach(RADIODATA => {
			let row = $('<tr></tr>');

			// Creazione delle celle e degli elementi con jQuery
			let imgIcon = $('<td></td>').append($('<img>', {
				src: RADIODATA.icons,
				style: 'width:40px',
				alt: 'Radio Icon'
			}).attr('onerror', "this.src='favicon.ico'"));
			

			let nome = $('<td></td>').text(RADIODATA.nome);
			let codec = $('<td></td>').text(RADIODATA.codec);
			let bitrate = $('<td></td>').text(RADIODATA.bitrate);
			let votes = $('<td></td>').text(RADIODATA.votes);

			// Creazione della cella con l'immagine del like
			let imgLike = $('<td></td>').append($('<img>', {
				src: 'like.jpg',
				alt: 'Like',
				class: 'imgLike',
				style: 'width:40px; cursor: pointer;',
				'data-id': RADIODATA.id // Imposta l'ID come attributo data
			}));

			// Gestore del click per l'immagine del like
			imgLike.on("click", function () {
				let idLike = $(this).find('img').data('id'); // Prendi l'ID dal data-id
				GET_LIKESTATE(idLike); // Passa l'ID alla funzione GET_LIKESTATE
			});

			row.append(imgIcon).append(nome).append(codec).append(bitrate).append(votes).append(imgLike);
			table.append(row);
		});
	}
}

async function GET_LIKESTATE(idLike) {
  let like = await inviaRichiesta("PATCH" , "/api/like", {idLike})
  if(like)
    alert('Like Effettuato!!')
 
}