import * as http from 'http';
import dispatcher from './dispatcher';
import headers from './headers.json';
import fs from 'fs';
import news from './news.json';
import path from 'path'
import { json } from 'stream/consumers';

const PORT = 1337;

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

  const eachNews: string[] = []

  news.forEach(singleNews => {
    console.log(singleNews)
    eachNews.push(JSON.stringify(singleNews))
  });

  const formattedNews = formatNewsData(news)
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(formattedNews));
  res.end();
});

dispatcher.addListener('POST', '/api/dettagli', function (req: any, res: any) {
  const { file } = req['BODY'];

    const index = news.findIndex(function (p) {
        return JSON.stringify(p.file) == JSON.stringify(file);
    });

    fs.readFile('./news.json', function (err) {
        if (!err) {
            res.writeHead(200, headers.json);
            res.write(JSON.stringify(news));
            res.end();
        }
        else {
            res.writeHead(500, headers.text);
            res.write('Impossibile salvare i dati');
            res.end();
        }
    });
});