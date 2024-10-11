import * as http from 'http';
import dispatcher from './dispatcher';
import headers from './headers.json';
import fs from 'fs';
import states from './states.json';
import radios from './radios.json'
import { format } from 'path';

const PORT = 1337;

/* function formatPeopleData(peopleList) {
  return peopleList.map(person => ({
    image : `${person.picture.large}`,
    name: `${person.name.title} ${person.name.first} ${person.name.last}`,
    city: person.location.city,
    state: person.location.state,
    cell: person.cell,
    gender: person.gender,
    address: person.location,
    email: person.email,
    dob: person.dob

  }));
} */


function formatNewsData(stateList) {
  return stateList.map(stateItem => ({
    name: stateItem.name,
    stationCount: stateItem.stationcount,

  }));
}
function formatRadioData(radioList) {
  return radioList.map(radioItem => ({
    favicon: radioItem.favicon,
    nome: radioItem.name,
    codec: radioItem.codec,
    bitrate: radioItem.bitrate,
    votes: radioItem.votes
  }));
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

// Listener per /api/country, usa i dati da people.json
dispatcher.addListener('GET', '/api/elenco', function (req: any, res: any) {
  const eachState: string[] = [];


  states.forEach(state => {
    console.log(state)
    eachState.push(JSON.stringify(state))
  });
  const formattedData = formatNewsData(states)
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(states));
  res.end();
});

// Listener per /people, restituisce tutto il contenuto di people.results
dispatcher.addListener('POST', '/api/radios', function (req, res) {
  const name = req['body']['name'];  // Ottieni il nome dalla query string
  const filteredRadios = radios.filter(radio => radio.name === name);  // Filtra le radio per la regione selezionata
  // Formatt i dati delle radio filtrate
  const formattedData = formatRadioData(filteredRadios);
  // Imposta l'intestazione e invia i dati formattati al client
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(formattedData));
  res.end();
});
