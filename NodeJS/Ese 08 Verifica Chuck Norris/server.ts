import * as http from 'http';
import dispatcher from './dispatcher';
import headers from './headers.json';
import fs from 'fs';
import factsJson from './facts.json'; // Assicurati che questo sia un array


const PORT = 1337;

// Funzione per formattare i dati delle radio
function formatFactData(factsJson: any[]) {
  return factsJson.map(fact => ({
    id: fact.id,
    value: fact.value
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
dispatcher.addListener('GET', '/api/categories', function (req: any, res: any) {
  let categories: string[] = [];

  // Itera attraverso i facts e aggiungi tutte le categorie
  factsJson.facts.forEach(fact => {
    fact.categories.forEach(category => {
      categories.push(category); // Aggiungi ogni singola categoria all'array
     
    });
  });

  // Rimuovi i duplicati usando un Set
  let NoDuplicatesVector: string[] = [...new Set(categories)];

  // Invia la risposta con l'array delle categorie uniche
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(NoDuplicatesVector));
  res.end();
});

dispatcher.addListener('POST', '/api/facts', function (req, res) {
  
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(''));
  res.end();
});