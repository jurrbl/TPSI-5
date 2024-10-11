import * as http from 'http';
import dispatcher from './dispatcher'; 
import headers from './headers.json'; 
import fs from 'fs';
import news from './news.json';  // people.json contiene un oggetto con una proprietà "results"
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

  
  function formatNewsData(newsList) {
    return newsList.map(newsItem => ({
        titolo: newsItem.titolo,
        visualizzazioni: newsItem.visualizzazioni,
        file: newsItem.file
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
  const notizie: string[] = [];

  
  news.forEach(notizia => {
    console.log(notizia)
    notizie.push(JSON.stringify(notizia))
  });
  const formattedData = formatNewsData(notizie)
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(formattedData));

  res.end();
});
