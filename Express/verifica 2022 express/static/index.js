"use strict";
$(document).ready(function () {
	let _sez1 = $("#sez1");
	let _btnAggiungiDomanda = $("#btnAggiungiDomanda");
	let _btnAvviaTest = $("#btnAvviaTest");

	let _sez2 = $("#sez2");
	let _txtFile = $("input[type=file]");
	let _btnCaricaDomanda = $("#btnCaricaDomanda");

	let _sez3 = $("#sez3");
	let _elencoDomande = $("#elencoDomande");
	let _btnInvia = $("#btnInvia");

	_sez2.hide();
	_sez3.hide();


	_btnAggiungiDomanda.on("click", function () {
		_sez2.show();

		_txtFile.on("change", async function () {
			let file = _txtFile.prop("files")[0];
			let reader = new FileReader();
			reader.onload = function () {
				$("#imgNuovaDomanda").prop("src", reader.result);
			};
			reader.readAsDataURL(file);

			console.log(file.name);
			let fileName = file.name;

			// Costruzione dell'URL senza caratteri extra
			const url = `/api/getAnswers?fileName=${fileName}`;

			// Effettua la richiesta GET
			const request = await inviaRichiesta("GET", url);

			if (request.status == 200) {
				console.log(request.data.risposte);
				$("#txtDomanda1").val(request.data.risposte[0]);
				$("#txtDomanda2").val(request.data.risposte[1]);
				$("#txtDomanda3").val(request.data.risposte[2]);
				$("#txtDomanda4").val(request.data.risposte[3]);
			} else {
				console.error("Errore: File non trovato.");
			}
		});
	});


	_btnCaricaDomanda.on("click", async function () { // Controlla che tutti i textbox siano stati compilati
		if ($("#txtDomanda1").val() == "" || $("#txtDomanda2").val() == "" || $("#txtDomanda3").val() == "" || $("#txtDomanda4").val() == "") {
			alert("Compila tutti i textbox!");
			return;
		}

		// Controlla che l'immagine sia stata selezionata
		if (_txtFile.prop("files").length == 0) {
			alert("Seleziona un'immagine!");
			return;
		}

		// Controlla che un radiobutton sia stato selezionato
		let radio = $("input[type=radio]:checked");
		if (radio.length == 0) {
			alert("Seleziona un radiobutton!");
			return;
		}

		// Se tutto è corretto
		let file = _txtFile.prop("files")[0];
		let reader = new FileReader();
		reader.onload = async function () { // Costruzione del record da inviare al server
			let domanda = {
				domanda: "Quale automobile è rappresentata in figura?",
				img: file.name, // Nome del file
				risposte: [
					$("#txtDomanda1").val(), $("#txtDomanda2").val(), $("#txtDomanda3").val(), $("#txtDomanda4").val(),
				],
				correct: radio.val(), // Indice della risposta corretta
			};

			// Creazione del FormData per inviare l'immagine binaria e il record
			let formData = new FormData();
			formData.append("file", file);
			formData.append("record", JSON.stringify(domanda));

			// Invio dei dati al server
			const request = await inviaRichiesta("POST", "/api/addQuestion", formData);

			if (request.status == 200) {
				alert("Domanda caricata con successo!");
				_sez2.hide(); // Nasconde la sezione 2
			} else {
				alert("Errore durante il caricamento della domanda.");
			}
		};

		reader.readAsDataURL(file);
	});


	_btnAvviaTest.on("click", async function () {

		_sez2.hide(); // Nasconde la sezione 2
		_sez3.show(); // Mostra la sezione 3

		const request = await inviaRichiesta("GET", "/api/getAllQuestions");

		if (request.status == 200) {
			let elencoDomande = request.data; // Lista delle domande dal server
			_elencoDomande.empty(); // Svuota la sezione delle domande

			elencoDomande.forEach((domanda, index) => { // Creazione dinamica della struttura HTML per ogni domanda
				let row = $(`
			  <div class="row mb-4">
				<div class="col-sm-6">
				  <img src="img/${
					domanda.img
				}" alt="${
					domanda.img
				}" class="img-fluid">
				</div>
				<div class="col-sm-6">
				  <p>${
					domanda.domanda
				}</p>
				</div>
			  </div>
			`);

				domanda.risposte.forEach((risposta, i) => {
					let radio = $(`
				<div>
				  <input type="radio" name="opt${index}" value="${i}">
				  <span>${risposta}</span>
				</div>
			  `);
					row.find(".col-sm-6:last").append(radio); // Aggiunge i radio button
				});

				_elencoDomande.append(row); // Aggiunge la domanda alla sezione
			});

			_elencoDomande.append(`
			<button id="btnInvia" class="btn btn-primary">Invia Risposte</button>
		  `);

			// Aggiungi evento al pulsante "Invia Risposte"
			$("#btnInvia").on("click", async function () {
				let vett = []; // Vettore delle risposte

				elencoDomande.forEach((domanda, index) => {
					let rispostaSelezionata = $(`input[name="opt${index}"]:checked`).val();
					vett.push({
						id: domanda._id, // ID della domanda
						indiceRisposta: rispostaSelezionata !== undefined ? parseInt(rispostaSelezionata) : null
					});
				});

				// Invio delle risposte al server
				const risposta = await inviaRichiesta("POST", "/api/submitAnswers", {ris: vett});

				if (risposta.status == 200) {
					alert(`Risultato: ${
						risposta.data.punteggio
					} punti`);
				} else {
					alert("Errore durante la valutazione delle risposte");
				}
			});
		} else {
			alert("Errore durante il caricamento delle domande.");
		}
	});


});
