let parsedStates = [];
let clickedState;
let idLike;

window.onload = async function () {
  let states = await inviaRichiesta("GET", "/api/elenco");  // Ottiene l'elenco delle regioni
  let lstRegioni = $("#lstRegioni");

  if (states) {
    // Popola la lista delle regioni
    states.forEach(singleState => {
      parsedStates.push(singleState);
      // Aggiungi ogni opzione alla lista <select> con il valore univoco della regione
      $("<option>")
        .val(singleState.name)  // Imposta il valore della regione
        .text(`${singleState.name} [${singleState.stationcount} emittenti]`)
        .appendTo(lstRegioni);
    });

    // Usa l'evento 'change' per ottenere la selezione dell'utente
    lstRegioni.on("change", async function () {
      clickedState = $(this).val();  // Ottieni lo stato selezionato
      console.log("Selected State: ", clickedState); // Debugging
      await showTable(clickedState);  // Chiama la funzione showTable
    });
  }
};

async function showTable(clickedState) {
  // Seleziona una sola volta l'elemento tbody
  let tbody = $("#tbody");
  
  // Svuota il contenuto precedente del tbody
  tbody.empty();

  // Invia la richiesta al server passando il clickedState
  let response = await inviaRichiesta('POST', '/api/radios', { clickedState });

  // Cicla attraverso i dati della risposta e aggiungi le righe alla tabella
  response.forEach(RADIODATA => {
    console.log(RADIODATA);
    idLike = RADIODATA.id;  // Imposta l'id della radio

    // Crea una nuova riga per ogni dato radio
    let row = $('<tr></tr>');

    // Creazione delle celle e degli elementi con jQuery
    let imgIcon = $('<td></td>').append($('<img>', {
        src: RADIODATA.icons,
        style: 'width:40px',
        alt: 'Radio Icon'
    }));
    
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
        'data-id': RADIODATA.id  // Aggiungo un data-id per identificare l'elemento
    })).on("click", async function()
    {
        let radioName = $(this).closest('tr').find('td:nth-child(2)').text();  // Ottieni il nome della radio
        let radioId = $(this).data('id');  // Ottieni l'id della radio dal data-id
        alert(`You liked: ${radioName}`);
        
        // Invia la richiesta di like
        let like = await inviaRichiesta("PATCH", "/api/like", {radioId});
        
        if (like) {
          console.log('Like registered successfully');
          $(this).attr('src', 'liked.jpg');  // Cambia l'icona al click
        }
    });
    
    // Aggiungo tutte le celle alla riga
    row.append(imgIcon)
       .append(nome)
       .append(codec)
       .append(bitrate)
       .append(votes)
       .append(imgLike);
    
    // Appendo la riga alla tabella
    $('#tbody').append(row);
  });
}

