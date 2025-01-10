'use strict';

import http from 'http';
import fs from 'fs';
import express, { NextFunction, Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import fileUpload from 'express-fileupload';
import { resourceLimits } from 'worker_threads';

/* ********************** Mongo config ********************** */
dotenv.config({ path: '.env' });
const db_name = process.env.db_name;
const connectionString = process.env.MONGODB_CONNECTION_STRING_ATLAS!;

/* ********************** HTTP server ********************** */
const port = process.env.PORT;
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
      paginaErrore = '<h1>Resource not found</h1>';
    }
  });
}
/* ********************** Middleware ********************** */
// 1. Request log
app.use('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method + ': ' + req.originalUrl);
  next();
});

// 2. Static resources
app.use('/', express.static('./static'));

// 3. Body params
app.use('/', express.json({ limit: '10mb' })); // Parsifica i parametri in formato json
app.use('/', express.urlencoded({ limit: '10mb', extended: true })); // Parsifica i parametri urlencoded

// 4. Upload config
app.use('/', fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));

// 5. Params log
app.use('/', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    console.log('--> GET params: ' + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length > 0) {
    console.log('--> BODY params: ' + JSON.stringify(req.body));
  }
  next();
});

// 6. CORS
const whitelist = [
  'http://my-crud-server.herokuapp.com ', // porta 80 (default)
  'https://my-crud-server.herokuapp.com ', // porta 443 (default)
  'http://localhost:3000',
  'https://localhost:3001',
  'http://localhost:4200', // server angular
  'https://cordovaapp' // porta 443 (default)
];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin)
      // browser direct call
      return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    } else return callback(null, true);
  },
  credentials: true
};
app.use('/', cors(corsOptions));
/* ********************** Client routes ********************** */

app.get('/api/images', async (req: Request, res: Response) => {
  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    const db = client.db(db_name);
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);
    console.log('Collections disponibili:', collectionNames);

    if (!collectionNames.includes('Users')) {
      return res.status(404).send('La collection "Users" non esiste.');
    }

    const collection = db.collection('Users');
    const data = await collection.find().toArray();
    res.send(data);
  } catch (err) {
    res.status(500).send(`Errore durante la connessione o query: ${err.message}`);
  } finally {
    client.close();
  }
});


app.post("/api/uploadBinary", async (req :any, res :any, next :any) => {
  const {user} = req["body"];
  const {img} = req["files"];

  fs.writeFile("./static/img/" + img.name, img.data, async function(err :any){
      if(err)
      {
          res.status(500).send(err.message);
      }
      else
      {
          const newUser = {
              "username": user,
              "img": img.name
          };
          const client = new MongoClient(connectionString);
          await client.connect().catch(function(err){res.status(503).send("Error: connection to DB server didn't went throught")});
          let collection = client.db(db_name).collection("Users")
          collection.insertOne(newUser)
          .then(function(data){
              res.send(data);
          })
          .catch(function(err){
              res.status(500).send("Error: wrong query execution; " + err.message);
          })
          .finally(function(){
              client.close();
          })
      }
    });
})
/* ********************** Default Route & Error Handler ********************** */
app.use('/', (req: Request, res: Response) => {
  res.status(404);
  if (!req.originalUrl.startsWith('/api/')) {
    res.send(paginaErrore);
  } else {
    res.send(`Resource not found: ${req.originalUrl}`);
  }
});

app.use((err: any, req: Request, res: Response) => {
  console.log(err.stack);
  res.status(500).send(err.message);
});
