import * as http from 'http'; // Importa http in TypeScript
import dispatcher from './dispatcher'; // Mantieni l'importazione di dispatcher, assicurati che esista
import headers from './static/headers.json'; // Assicurati che questo file sia disponibile
import fs from 'fs';
import people from './people.json'



const PORT = 1337;

const server = http.createServer(function (req, res) {
  // Aggiungi qui eventuali logiche di routing o middleware
});

server.listen(PORT, function () {
  console.log('Server in ascolto sulla porta: ' + PORT);
});

/***  Registrazione dei listener ***/
dispatcher.addListener('GET', '/country', function (req, res) {
  console.log("GET /country");
  res.writeHead(200, headers.json);
  res.write(JSON.stringify("people"));
  res.send();
  res.end();
});

dispatcher.addListener('POST', '/api/servizio2', function (req, res) {
  res.writeHead(200, headers.json);
  res.write(JSON.stringify('Benvenuto'));
  res.end();
});
