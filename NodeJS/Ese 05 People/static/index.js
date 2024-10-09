let currentCountry; // nazione attualmente selezionata
let people; // vettore enumerativo delle Persone attualmente visualizzate
let currentPos; // Posizione del dettaglio corrente (rispetto al vettore enumerativo people)
let vectNations = [];
let _divDettagli;
let currentIndex = 0;
let _tabStudenti;

window.onload = async function () {
    let _lstNazioni = $("#lstNazioni");
    _divDettagli = $("#divDettagli");
    let _dropdownButton = $("#dropdownMenuButton");
    _divDettagli.hide();

    let countries = await inviaRichiesta("GET", "/api/country");
    if (countries) {
        console.log(countries);
        countries.forEach(nations => {
            $("<a>").addClass("dropdown-item").prop('href', '#').text(nations).appendTo(_lstNazioni)
                .on("click", function () {
                    currentCountry = $(this).text();
                    _dropdownButton.text(currentCountry);
                    sendPeopleRequest(currentCountry);
                });
        });
    }
};

async function sendPeopleRequest(clickedNation) {
    console.log(clickedNation);

    // Invio della richiesta e recupero dei dati
    people = await inviaRichiesta("GET", "/api/people", { 'country': clickedNation });
    if (people) {
        console.log('Dati: ' + JSON.stringify(people, null, 2));
    }

    let _tabStudenti = $("#tabStudenti");
    _tabStudenti.empty(); // Svuota la tabella

    // Itera sui dati ricevuti e crea le righe della tabella
    people.forEach((singleStudent, index) => {
        let row = `
            <tr>
                <td>${singleStudent.name}</td>
                <td>${singleStudent.city}</td>
                <td>${singleStudent.state}</td>
                <td>${singleStudent.cell}</td>
                <td>
                    <button class="confirmButton" data-index="${index}">Dettagli</button>
                </td>
                <td>
                    <button class="deleteButton" data-index="${index}">Elimina</button>
                </td>
            </tr>
        `;
        _tabStudenti.append(row); // Aggiungi riga alla tabella
    });

    // Delegazione degli eventi click per i bottoni "Dettagli"
    _tabStudenti.off("click", ".confirmButton"); // Rimuovi eventuali listener precedenti per evitare duplicazioni
    _tabStudenti.on("click", ".confirmButton", function () {
        const index = $(this).data('index');  // Ottieni l'indice dal button
        const student = people[index];        // Recupera il dato corrispondente
        currentIndex = index;                 // Aggiorna l'indice corrente
        showDettagli(student);                // Mostra i dettagli
    });

    // Delegazione degli eventi click per i bottoni "Elimina"
    _tabStudenti.off("click", ".deleteButton"); // Rimuovi eventuali listener precedenti
    _tabStudenti.on("click", ".deleteButton", function () {
        const row = $(this).closest("tr");
        row.remove();

        // Aggiorna l'array people dopo la rimozione
        const index = $(this).data('index');
        people.splice(index, 1);

        // Aggiorna currentIndex se necessario
        if (currentIndex >= people.length) {
            currentIndex = people.length - 1; // Ritorna all'ultimo indice valido
        }

        // Mostra il nuovo studente corrente se disponibile
        showCurrentStudent();
    });

    // Pulsanti di navigazione
    $("#firstButton").on("click", function () {
        currentIndex = 0; // Vai al primo record
        showCurrentStudent();
    });

    $("#previousButton").on("click", function () {
        if (currentIndex > 0) {
            currentIndex--; // Vai al record precedente
        }
        showCurrentStudent();
    });

    $("#nextButton").on("click", function () {
        if (currentIndex < people.length - 1) {
            currentIndex++; // Vai al record successivo
        }
        showCurrentStudent();
    });

    $("#lastButton").on("click", function () {
        currentIndex = people.length - 1; // Vai all'ultimo record
        showCurrentStudent();
    });
}

function showCurrentStudent() {
    if (people && people.length > 0) {
        showDettagli(people[currentIndex]);
    } else {
        _divDettagli.hide(); // Nascondi i dettagli se non ci sono studenti
    }
}

function showDettagli(selectedStudentForDetails) {
    console.log('SelectedStudentsForDetails: ' + JSON.stringify(selectedStudentForDetails, null, 2));

    _divDettagli.show();
    let cardTitle = $('.card-title');
    let cardText = $('.card-text');
    let studentImage = $('#studentImage'); // Assicurati di avere l'ID giusto per l'immagine

    let detailsHtml = `
        <img src="${selectedStudentForDetails.image}" alt="Student Image" style="width: 10em; margin: 6px auto;"><br>
        <strong>Gender:</strong> ${selectedStudentForDetails.gender}<br>
        <strong>Address:</strong> ${JSON.stringify(selectedStudentForDetails.address)}<br>
        <strong>Email:</strong> ${selectedStudentForDetails.email}<br>
        <strong>Dob:</strong> ${selectedStudentForDetails.dob.date} (Age: ${selectedStudentForDetails.dob.age})<br>
    `;

    cardTitle.text(selectedStudentForDetails.name);
    cardText.html(detailsHtml);
}
