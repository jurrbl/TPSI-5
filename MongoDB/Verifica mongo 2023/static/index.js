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
	if (data) {


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
async function getPiloti(id) {
    console.log('ID ricevuto: ' + id);
    const data = await inviaRichiesta("GET", `/api/getPiloti`, { id });

    if (data) {
        console.log(data);
        // Svuota il contenitore prima di aggiungere nuove card
        detailsContainer.empty();
		data.piloti.forEach(element => {
			let pilotaSingolo = Object.values(element['piloti'][0])[0]
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
