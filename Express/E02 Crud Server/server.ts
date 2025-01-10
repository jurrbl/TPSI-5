'use strict';

import http from 'http';
import fs from 'fs';
import express, { NextFunction, Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

/* ********************** Mongo config ********************** */
dotenv.config({ path: '.env' });
const dbName = process.env.dbName;
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
app.use('/', express.json({ limit: '50mb' })); // Parsifica i parametri in formato json
app.use('/', express.urlencoded({ limit: '50mb', extended: true })); // Parsifica i parametri urlencoded

// 4. Params log
app.use('/', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    console.log('--> GET params: ' + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length > 0) {
    console.log('--> BODY params: ' + JSON.stringify(req.body));
  }
  next();
});

// 5. CORS
const whitelist = [
  'http://my-crud-server.herokuapp.com', // porta 80 (default)
  'https://my-crud-server.herokuapp.com', // porta 443 (default)
  'http://localhost:3000',
  'https://localhost:3001',
  'http://localhost:4200', // server angular
  'https://cordovaapp' // porta 443 (default)
];
const corsOptions = {
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
app.get('/api/collections', async (req: Request, res: Response) => {
  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db(dbName);

  const request = db.listCollections().toArray();
  request.then((data) => {
    res.send(data);
  });
  request.catch((err) => {
    res.status(500).send(`Collections access error: ${err}`);
  });
  request.finally(() => {
    client.close();
  });
});

app.get('/api/:collection', async (req: Request, res: Response) => {
  const { collection: collectionName } = req.params;

  const client = new MongoClient(connectionString);
  await client.connect();
  const collection = client.db(dbName).collection(collectionName);

  const request = collection.find({}).toArray();
  request.catch((err) => {
    res.status(500).send(`Errore esecuzione query: ${err}`);
  });
  request.then((data) => {
    res.send(data);
  });
  request.finally(() => {
    client.close();
  });
});

app.get('/api/:collection/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const _id: any = ObjectId.isValid(id) ? new ObjectId(id) : id;
  const { collection: collectionName } = req.params;

  const client = new MongoClient(connectionString);
  await client.connect();
  const collection = client.db(dbName).collection(collectionName);

  collection
    .findOne({ _id })
    .catch((err) => {
      res.status(500).send(`Error in query execution: ${err}`);
    })
    .then((data) => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});

app.post('/api/:collection/', async (req: Request, res: Response) => {
  const newRecord = req.body;

  const collectionName = req.params.collection;
  const client = new MongoClient(connectionString);
  await client.connect();
  const collection = client.db(dbName).collection(collectionName);

  collection
    .insertOne(newRecord)
    .catch((err) => {
      res.status(500).send('Error in query execution: ' + err);
    })
    .then((data) => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});

app.delete('/api/:collection/:id', async (req: Request, res: Response) => {
  const { id, collection: collectionName } = req.params;
  const _id: any = ObjectId.isValid(id) ? new ObjectId(id) : id;

  const client = new MongoClient(connectionString);
  await client.connect();
  const collection = client.db(dbName).collection(collectionName);

  collection
    .deleteOne({ _id })
    .catch((err) => {
      res.status(500).send('Error in query execution: ' + err);
    })
    .then((data) => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});

app.put('/api/:collection/:id', async (req: Request, res: Response) => {
  const { id, collection: collectionName } = req.params;
  const _id: any = ObjectId.isValid(id) ? new ObjectId(id) : id;
  const { action } = req.body;

  const client = new MongoClient(connectionString);
  await client.connect();
  const collection = client.db(dbName).collection(collectionName);

  collection
    .updateOne({ _id: _id }, action)
    .catch((err) => {
      res.status(500).send('Error in query execution: ' + err);
    })
    .then((data) => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});

app.patch('/api/:collection/:id', async (req: Request, res: Response) => {
  const { id, collection: collectionName } = req.params;
  const { action } = req.body;
  const _id: any = ObjectId.isValid(id) ? new ObjectId(id) : id;

  const client = new MongoClient(connectionString);
  await client.connect();
  const collection = client.db(dbName).collection(collectionName);

  collection
    .updateOne({ _id }, { $set: action })
    .catch((err) => {
      res.status(500).send('Error in query execution: ' + err);
    })
    .then((data) => {
      res.send(data);
    })
    .finally(() => {
      client.close();
    });
});
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