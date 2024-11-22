"use strict";
let optContainer;
let detailsContainer;
$(document).ready(function () {

	optContainer = $(".optContainer")
	detailsContainer = $(".detailsContainer").hide()


	getScuderie()


});

async function getScuderie() {
	const data = await inviaRichiesta("GET", "/api/getCategories");
	if (data && Array.isArray(data)) {


		console.log(data)
		for (let i = 0; i < data.length; i++) {

			let team = data[i].scuderia;

			let opt = `
                <label class="form-check-label">
                    <input type="radio" class="form-check-input" name="scuderia" value="${data[i]._id}" />
                    <span>${team}</span>
                </label>
            `;

			optContainer.append(opt);


			$(`.form-check-input[value="${
				data[i]._id
			}"]`).click(function () {
				detailsContainer.show()
				getPiloti(data[i]._id)
			})

		}

	}
}



/* Visualizzare le squadre che NON utilizzano pneumatici Pirelli. Visualizzare scuderia e penumatici [ 
  { 
    scuderia: 'Aston Martin Cognizant Formula One Team', 
    pneumatici: 'Bridgestone' 
  }, 
  { 
    scuderia: 'Haas F1 Team', 
    pneumatici: 'Bridgestone' 
  } 
] 
 2) Elenco delle scuderie che utilizzano motore Ferrari, pneumatici Pirelli e che hanno anche un pilota 
italiano. Visualizzare scuderia, motore, pneumatici e nome del pilota italiano.  
Si assume che non ci siano squadre con 2 piloti italiani [ 
   { 
      "scuderia": "Alfa Romeo Racing Orlen", 
      "pneumatici": "Pirelli", 
      "motore": "Ferrari", 
      "piloti": [ 
         { 
            "nome": "Antonio Giovinazzi" 
         } 
      ] 
   } 
] 
 3) Nella scuderia McLaren (scritto tramite una regular expression) aggiungere il pilota australiano Oscar 
Piastri il quale fungerà da terzo pilota collaudatore. Non ha numero,  punti 0,  data di nascita 6 aprile 2001   4) Incrementare di 10 i punti di Verstappen (scritto tramite regex) della scuderia Red Bull che passa da 163 a 
173  5) Trovare i piloti del Regno Unito che hanno più di 10 punti. Visualizzare nome Pilota, scuderia e punti */
async function getPiloti(id) {
    console.log('ID ricevuto: ' + id);
	const data = await inviaRichiesta("GET", `/api/getPiloti?id=${id}`);

    if (data) {
        console.log(data);
        // Svuota il contenitore prima di aggiungere nuove card
        detailsContainer.empty();
		data.forEach(element => {
			let pilotaSingolo = element.nome;
			/* Il client infine visualizza i piloti (nome e immagine) all’interno di una sequenza di oggetti card strutturati come indicato nel file html allegato. La card di esempio dovrà poi essere rimossa. 
Il nome del file relativo all’immagine corrisponde al nome del pilota in cui, per evitare problemi legami a Bootstrap, lo spazio è stato sostituito con un trattino.  
 
	 */

			let pilota = `<div class="card">
								<div class="card-header bg-secondary text-white font-weight-bold">
									${pilotaSingolo}
								</div>
								<div class="card-body">
								<img src="img/${pilotaSingolo.replace(/ /g, "-")}.jpg" class="card-img-top" />
								</div>
							</div>`



			detailsContainer.append(pilota);
		});
    }
}




