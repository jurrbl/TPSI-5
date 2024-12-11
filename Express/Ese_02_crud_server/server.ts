'use strict';

import http from 'http';
import fs from 'fs';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

/* *********************** Dot ENV *********************** */

import dotenv from 'dotenv';

/* *********************** Mongo Settings *********************** */
dotenv.config({ path: '.env' });
const db_name = process.env.db_name;
import { MongoClient, ObjectId } from 'mongodb';

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


app.get("/api/getCollections", async (req: Request, res: Response, next: NextFunction) => {
  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db(db_name);
  const request = db.listCollections().toArray();

  request.then((data) => {
    res.send(data);
  }).catch((err) => {
    res.status(500).send("Collection access error: " + err);
  }).finally(() => {
    client.close();
  });
});



app.get("/api/:collection", async function (req: Request, res: Response, next: NextFunction) {


  const filter = req.query;

  const collectionName = req.params.collection;

  const client = new MongoClient(connectionString);
  await client.connect();
  const collection = client.db(db_name).collection(collectionName);
  const request = collection.find(filter).toArray();
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
);


app.patch("/api/:collection/:id", async function (req: Request, res: Response, next: NextFunction) {

  let id = req.params.id;
  let objectId = new ObjectId(id);
  if (!id) {
    let msg = "Missing parameter 'id'";
    res.status(400).send(msg);
  }
  else {
    const client = new MongoClient(connectionString);
    await client.connect();
    const collection = client.db(db_name).collection(req.params.collection);

    const filter = { _id: objectId };
    const action = { $set: req.body };

    collection.updateOne(filter, action)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send("Errore esecuzione query: " + err);
      })
      .finally(() => {
        client.close();
      });
  }
});
app.get("/api/:collection/:id", async (req: any, res: any, next: any) => {
  let collectionName = req.params.collection;
  let id = req.params.id;
  const client = new MongoClient(connectionString);
  await client.connect();
  let collection = client.db(db_name).collection(collectionName);

  let _id = new ObjectId(id);

  collection.findOne({ _id })
    .catch(err => {
      res.status(500).send("Error in query execution: " + err);
    })
    .then(data => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});
app.get('/api/:collection/:id', async function (req: Request, res: Response, next: NextFunction) {
  const gender = req.params.gender;
  const hair = req.params.hair;
  const client = new MongoClient(connectionString);
  await client.connect();
  const collection = client.db(db_name).collection("Unicorns");
  const request = collection.find({
    gender: gender,
    hair: hair
  }).toArray();
  request.catch(err => {
    res.status(500).send("Errore esecuzione query: " + err);
  });
  request.then(data => {
    res.send(data);
  });
  request.finally(() => {
    client.close();
  });
})



app.post('/api/collection/', async function (req: Request, res: Response, next: NextFunction) {

  const newRecord = req.body;
  
  let collectionName = newRecord.collection;
  const client = new MongoClient(collectionName)
  await client.connect;
  let collection = client.db(db_name).collection(collectionName);

  collection.insertOne(newRecord)
    .catch(err => {
      res.status(500).send("Error in query execution: " + err);
    })
    .then(data => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
}
);

app.delete('/api/:collection/:id', async (req: Request, res: Response, next: NextFunction) => {
  
  const collectionName = req.params.collection;
  const id = req.params.id;
  let oid = new ObjectId(id)
  const client = new MongoClient(connectionString)
  await client.connect();
  const collection = client.db(db_name).collection(collectionName)
  const request = collection.deleteOne({ "_id": oid });
  request.catch((err) => {
    res.status(500).send(`Errore esecuzione query: ${err}`)
  })
  request.then((data) => {
    res.send(data)
  })
  request.finally(() => {
    client.close();
  })
})



/* ********************** Default Route ********************** */

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send(paginaErrore);
  if (!req.originalUrl.startsWith('/api/')) {
    res.send(paginaErrore);
  } else {
    res.send(`Resource not found' : ${req.originalUrl}`);
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack)
  res.status(500).send(err.message);
});