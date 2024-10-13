import * as http from 'http';
import dispatcher from './dispatcher';
import headers from './headers.json';
import fs from 'fs';
import radiosData from './radios.json'; // Assicurati che questo sia un array
import statesData from './states.json'; // Assicurati che questo sia un array

const PORT = 1337;

// Funzione per formattare i dati delle radio
function formatRadioData(radioList: any[]) {
  return radioList.map(radio => ({
    id: radio.id,
    nome: radio.name,
    icons: radio.favicon,
    codec: radio.codec,
    bitrate: radio.bitrate,
    votes: radio.votes,
  }));
}

// Funzione per scrivere file JSON
function writeJsonFile(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Funzione per aggiornare il conteggio delle stazioni
function updateStationCount(states: any[], radios: any[]) {
  // Resetta il conteggio delle stazioni per ogni stato
  states.forEach(state => {
    state.stationcount = 0;
  });

  // Conta quante stazioni appartengono a ciascuno stato
  radios.forEach(radio => {
    const stateFound = states.find(state => state.name === radio.state);
    if (stateFound) {
      stateFound.stationcount++; // Incrementa il conteggio per la regione trovata
    }
  });

  return states;
}

// Crea il server
const server = http.createServer(function (req, res) {
  // Aggiungi intestazioni CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Dispatcchia la richiesta
  dispatcher.dispatch(req, res);
});

// Ascolta sulla porta specificata
server.listen(PORT, function () {
  console.log('Server in ascolto sulla porta: ' + PORT);
});

/***  Registrazione dei listener ***/

// Listener per /api/elenco, restituisce l'elenco aggiornato degli stati
dispatcher.addListener('GET', '/api/elenco', function (req: any, res: any) {
  const datiAggiornati = updateStationCount(statesData, radiosData);
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(datiAggiornati));
  res.end();
});

// Listener per /api/radios, restituisce l'elenco delle radio per uno stato selezionato
dispatcher.addListener('POST', '/api/radios', function (req, res) {
  const { statoSelezionato } = req['BODY'];  // Ottiene lo stato selezionato dal body della richiesta
  console.log('STATO SELEZIONATO: ' + statoSelezionato);  // Log per debug

  // Filtra le radio in base allo stato selezionato
  const radiosForState = radiosData.filter(singolaRadio => singolaRadio.state === statoSelezionato);
  
  const formattedRadio = formatRadioData(radiosForState); // Format dei dati delle radio
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(formattedRadio)); // Restituisce i dati delle radio formattati come JSON
  res.end();
});

// Listener per aggiornare i like delle radio
dispatcher.addListener('PATCH', '/api/like', function (req: any, res: any) {
  const { idLike } = req['BODY'];  // Ottiene l'id della radio a cui mettere il like
  let radioToLike : any;
  radioToLike = radiosData.find(radio => radio.id === JSON.stringify(idLike));
  
  if (radioToLike) {
    radioToLike.votes++;  // Incrementa i voti della radio
    writeJsonFile('./radios.json', radiosData); // Aggiorna il file JSON con i nuovi voti
    res.writeHead(200, headers.json);
    res.write(JSON.stringify({ success: true, message: "Like aggiornato!" }));
  } else {
    res.writeHead(404, headers.json);
    res.write(JSON.stringify({ success: false, message: "Radio non trovata!" }));
  }

  res.end();
});
