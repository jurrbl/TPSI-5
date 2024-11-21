import * as http from 'http';
import dispatcher from './dispatcher';
import headers from './headers.json';
import fs from 'fs';
import f1File from './F1.json'; // Assicurati che questo sia un array
import { setEngine } from 'crypto';
const crypto = require('crypto');

const PORT = 1337;


import { MongoClient, ObjectId } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'Piloti';


// Funzione per formattare i dati delle radio
/* function formatFactData(factsJson: any[]) {
  return factsJson.map(fact => ({
    id: fact.id,
    value: fact.value
  }));
}  */


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
dispatcher.addListener('GET', '/api/getCategories', async function (req: any, res: any) {

  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  const collection = client.db(DB_NAME).collection('Piloti');

  const filter = {};
  const projection = {
    scuderia: 1
  };
  const request = collection.find(filter).project(projection).sort({ scuderia: 1 }).toArray();
  request.catch(function (err: Error) {
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  });
  request.then(function (data) {
    res.writeHead(200, headers.json);
    res.write(JSON.stringify(data));
    res.end();
  });
  request.finally(function () {
    client.close();
  });
});
 dispatcher.addListener('GET', '/api/getPiloti', async function (req, res) {
  const client = new MongoClient(connectionString);
  try {
    
    await client.connect();
    const collection = client.db(DB_NAME).collection('Piloti');

    const { id } = req['GET']; 
    if (!id) {
      res.writeHead(400, headers.json);
      res.write(JSON.stringify({ res: 'ID scuderia mancante' }));
      res.end();
      return;
    }


    const filter = { _id: new ObjectId(id) };


    const data = await collection
      .find(filter)
      .project({ scuderia: 1, piloti: 1 })
      .toArray();

    // Risposta al client
    res.writeHead(200, headers.json);
    res.write(JSON.stringify({ piloti: data }));
    res.end();
  } catch (error) {
    console.error('Errore connessione al db:', error);
    res.writeHead(500, headers.json);
    res.write(JSON.stringify({ res: 'Internal server error' }));
    res.end();
  } finally {
    client.close();
  }
});
