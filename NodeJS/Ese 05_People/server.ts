import * as http from 'http';
import dispatcher from './dispatcher'; 
import headers from './headers.json'; 
import fs from 'fs';
import people from './people.json';  // people.json contiene un oggetto con una proprietà "results"
import { format } from 'path';

const PORT = 1337;

<<<<<<< HEAD:NodeJS/Ese 05_People/server.ts
// Leggi i dati delle persone da people.json
=======
function formatPeopleData(peopleList) {
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
}
>>>>>>> 98d237dc61102650f02711482eb3d751368f0776:NodeJS/Ese 05 People/server.ts


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
<<<<<<< HEAD:NodeJS/Ese 05_People/server.ts
dispatcher.addListener('GET', '/country?', function (req, res) {
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(peopleData)); // Assicurati di inviare i dati delle persone
    
=======

// Listener per /api/country, usa i dati da people.json
dispatcher.addListener('GET', '/api/country', function (req: any, res: any) {
  const countries: string[] = [];

  // Itera su ogni persona in people.results e prendi il nome del paese
  people.results.forEach((person: any) => {
    let countryName = person.location.country;
    countries.push(countryName);
  });

  // Usa un Set per rimuovere i duplicati e poi crea un array ordinato
  let sortedNations = [...new Set(countries)].sort();

  res.writeHead(200, headers.json);
  res.write(JSON.stringify(sortedNations));
  res.end();
});

// Listener per /people, restituisce tutto il contenuto di people.results
dispatcher.addListener('GET', '/api/people', function (req, res) {

  const country = req['GET']['country']; // Recupera la nazione dalla query
  const peopleInCountry = people.results.filter(person => person.location.country === country); // Filtra le persone per paese

  const formattedData = formatPeopleData(peopleInCountry);
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(formattedData)); // Invia l'array filtrato di persone
>>>>>>> 98d237dc61102650f02711482eb3d751368f0776:NodeJS/Ese 05 People/server.ts
  res.end();
});