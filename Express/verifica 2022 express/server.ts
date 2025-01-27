import http from 'http';
import url from 'url';
import fs from 'fs';
import express, { response } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';

const app = express();

let paginaErr: string;

//MONGO
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const connectionString = process.env.MONGODB_CONNECTION_STRING_COMPASS;
const DB_NAME = process.env.db_name;
const PORT = process.env.PORT;
console.log(connectionString);

//la callback di create server viene eseguita ad ogni richiesta giunta dal client
http.createServer(app).listen(PORT, () => {
  console.log('Server listening on port: ' + PORT);
});

function init() {
  fs.readFile('./static/error.html', (err, data) => {
    if (!err) {
      paginaErr = data.toString();
    } else {
      paginaErr = '<h1>Not Found</h1>';
    }
  });
}

//Middleware
//1. Request log
app.use('/', (req: any, res: any, next: any) => {
  console.log(req.method + ': ' + req.originalUrl);
  next();
});

//2. Static resource
app.use('/', express.static('./static'));

//3. Buddy params
//Queste due entry ervono per agganciare i parametri nel body
app.use('/', express.json({ limit: '10mb' }));
app.use('/', express.urlencoded({ limit: '10mb', extended: true }));

//4. Upload config
app.use('/', fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));

//5. Params log
app.use('/', (req: any, res: any, next: any) => {
  if (Object.keys(req.query).length > 0) {
    console.log('--> parametri  GET: ' + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length > 0) {
    console.log('--> parametri  BODY: ' + JSON.stringify(req.body));
  }
  next();
});

//6. CORS
const whitelist = [
  'http://my-crud-server.herokuapp.com ', // porta 80 (default)
  'https://my-crud-server.herokuapp.com ', // porta 443 (default)
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
      var msg = `The CORS policy for this site does not
    allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    } else return callback(null, true);
  },
  credentials: true
};


//Client routes

app.get('/api/getAnswers', async (req, res) => {
  const client = new MongoClient(connectionString);
  await client.connect();
  const collections = client.db(DB_NAME).collection('Automobili');

  console.log('query:', req.query); // Log della query completa

  let { fileName } = req.query;

  // Rimuove eventuali caratteri extra come "?" alla fine
  fileName = fileName?.replace(/\?$/, '');

  console.log('fileName pulito:', fileName); // Logga il fileName pulito

  if (!fileName) {
    res.status(400).send('File parameter is missing');
    return;
  }

  const result = await collections.findOne({ "img": fileName });
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send('File not found');
  }
  client.close();
});



app.post('/api/addQuestion', async (req, res) => {
  const client = new MongoClient(connectionString);

  try {
      await client.connect();
      const collections = client.db(DB_NAME).collection('Automobili');

      const file = req.files.file; // Ottieni il file dall'upload
      const record = JSON.parse(req.body.record); // Ottieni il record JSON

      // Salvataggio dell'immagine nel server
      const filePath = `./static/img/${file.name}`;
      fs.writeFileSync(filePath, file.data);

      // Inserimento del record nel database
      await collections.insertOne(record);

      res.status(200).send({ message: 'Domanda aggiunta con successo!' });
  } catch (err) {
      console.error(err);
      res.status(500).send('Errore durante l\'inserimento della domanda.');
  } finally {
      client.close();
  }
});


app.get('/api/getAllQuestions', async (req, res) => {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const collections = client.db(DB_NAME).collection('Automobili');

    const domande = await collections.find({}).toArray(); // Recupera tutte le domande
    res.status(200).send(domande);
  } catch (err) {
    console.error(err);
    res.status(500).send('Errore durante il recupero delle domande.');
  } finally {
    client.close();
  }
});



app.post('/api/submitAnswers', async (req, res) => {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const collections = client.db(DB_NAME).collection('Automobili');

    const { ris } = req.body; // Vettore delle risposte
    let punteggio = 0;

    for (let risposta of ris) {
      if (risposta.indiceRisposta !== null) {
        // Recupera la domanda dal database
        const domanda = await collections.findOne({ _id: new ObjectId(risposta.id) });

        if (domanda && domanda.correct === risposta.indiceRisposta) {
          punteggio += 1; // Risposta esatta
        } else {
          punteggio -= 0.25; // Risposta sbagliata
        }
      }
    }

    res.status(200).send({ punteggio });
  } catch (err) {
    console.error(err);
    res.status(500).send('Errore durante la valutazione delle risposte.');
  } finally {
    client.close();
  }
});
