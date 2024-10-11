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
    id : radioItem.id,
    icons : radioItem.favicon,
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
  
    eachState.push(JSON.stringify(state))
  });
 
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(states));
  res.end();
});

// Listener per /people, restituisce tutto il contenuto di people.results
// Listener per /api/radios
dispatcher.addListener('POST', '/api/radios', function (req, res) {
  const radiosForNations: any[] = [];
  const { clickedState } = req['BODY'];  // Get the clickedState from the request body
  console.log('STATO DEL DIO: ' + clickedState);  // Debugging log

  radios.forEach(singolaRadio => {
      if (JSON.stringify(singolaRadio.state) === JSON.stringify(clickedState)) {
          radiosForNations.push(singolaRadio);  // Don't stringify individual radio objects
      }
  });

  const formattedRadio = formatRadioData(radiosForNations);  // Format the array of radio stations

  console.log(formattedRadio);  // Debugging log to check the output
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(formattedRadio));  // Send back the formatted radio data as a JSON string
  res.end();
});

dispatcher.addListener('PATCH', '/api/like', function (req: any, res: any) {

  const { id } = req['BODY']
  console.log('disdiasdisad : ' + id)
  fs.readFile(`radios.json`, (err, data) => {
    if (err) {
        res.writeHead(500, headers.json);
        res.write(JSON.stringify({ message: 'Internal server error' }));
        res.end();
        return;
    }

    const selectedLike = radios.find(r => r.id === id);
    if (selectedLike) {
      selectedLike.votes = selectedLike.votes + 1;
    }

    res.writeHead(200, headers.json);
    res.write(JSON.stringify({ data: data.toString() }));
    res.end();
});

});
