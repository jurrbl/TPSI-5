'use strict';

import http from 'http';
import fs from 'fs';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

/* *********************** Dot ENV *********************** */

import dotenv from 'dotenv';

/* *********************** Mongo Settings *********************** */
dotenv.config({path : '.env'});
const db_name = "Unicorns"
import { MongoClient } from 'mongodb';

const connectionString = process.env.MONGODB_CONNECTION_STRING_COMPASS!;

/* ********************** HTTP server ********************** */
const port = 3000;
let paginaErrore: string;
const app = express();
const server = http.createServer(app);
server.listen(port, () => {
  init();
  console.log(`Server listening on port ${port}`);
});
function init() {
  fs.readFile('./static/error.html', (err, data) => {
    if (!err) {
      paginaErrore = data.toString();
    } else {
      paginaErrore = '<h1>Risorsa non trovata</h1>';
    }
  });
}
/* ********************** Middleware ********************** */
// 1. Request log
app.use('/', (req: any, res: any, next: any) => {
  console.log(req.method + ': ' + req.originalUrl);
  next();
});

// 2. Static resources
app.use('/', express.static('./static'));  //cerca le risorse statiche se la trova la restituisce
                                          // se non la trova invece esegue next() ovvero continua nelle scansione della route

// 3. Body params questo permette di gestire il body delle richieste HTTP aggancia i parametri del body
app.use('/', express.json({ limit: '50mb' }));
app.use('/', express.urlencoded({ limit: '50mb', extended: true }));
//qua non si fa next() perchè lo fa in automatico 


// 4. Params log
app.use('/', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    console.log('--> Parametri GET: ' + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length > 0) {
    console.log('--> Parametri BODY: ' + JSON.stringify(req.body));
  }
  next();
});

/* ********************** Client routes ********************** */


app.get("/api/risorsa1", async function (req: Request, res: Response, next : NextFunction) {
  
  const unicornName = req.query.nome;

  if(!unicornName) {
    let msg = "Missing parameter 'nome'";
    res.status(400).send(msg);
  }
  else
  {
    const client = new MongoClient(connectionString);
    await client.connect();
    const collection = client.db(db_name).collection("Unicorns");
    const request = collection.find({name : unicornName}).toArray();
      request.catch(err => {
        res.status(500).send("Errore esecuzione query: " + err);
      });
      request.then(data => {
        res.send(data);
      });

      request.finally(() => {
        client.close();
      });
    }
  });
