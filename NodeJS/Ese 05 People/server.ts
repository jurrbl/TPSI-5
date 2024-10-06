import * as http from 'http';
import dispatcher from './dispatcher'; 
import headers from './static/headers.json'; 
import fs from 'fs';

const PORT = 1337;

// Leggi i dati delle persone da people.json
const peopleData = JSON.parse(fs.readFileSync('./people.json', 'utf-8'));


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
dispatcher.addListener('GET', '/countries', function (req, res) {
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(peopleData)); // Assicurati di inviare i dati delle persone
  res.end();
});

/***  Registrazione dei listener ***/
dispatcher.addListener('GET', '/people',function (req, res) {
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(peopleData)); // Assicurati di inviare i dati delle persone
  res.end();
});

