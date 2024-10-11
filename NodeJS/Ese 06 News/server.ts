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

function formatNewsText(textNews) {
  return textNews.map(newsItem => ({
    file : newsItem.file,
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

  fs.readFile(`news/${file}`, function(err, data)
  {
    if (err) 
    {
      res.writeHead(500, headers.json);
      res.write(JSON.stringify({ message: 'Internal server error' }));
      res.end();
      return;
    }

    const selectedNews = news.find(news => news.file === file)
    if(selectedNews)
    {
      selectedNews.visualizzazioni++;

    }

    res.writeHead(200, headers.text);
    res.write(JSON.stringify(data.toString()));
    res.end();
  })
});