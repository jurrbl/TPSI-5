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
const DB_NAME_LINK = process.env.db_name_link;
const DB_NAME_UTENTI = process.env.db_name_user;
const DB_NAME_VOCI = process.env.db_name_voci;
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

app.post('/api/login', cors(corsOptions), async (req, res) => {
  const client: MongoClient = new MongoClient(connectionString);
  await client.connect();
  const collections = client.db(DB_NAME_UTENTI).collection('Utenti');
  const user: { username: string; password: string } = req.body;
  const result = await collections.findOne<{ username: string; password: string }>({ username: user.username, password: user.password });
  if (result) {
    
    res.status(200).send(result);
  } else {
    res.status(401).send('Invalid credentials');
  }
  client.close();
});


app.post('/api/register', async (req, res) => {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const collections = client.db(DB_NAME_UTENTI).collection('Utenti');

    const username = req.body.username;
    const password = req.body.password;
    const img = req.files.img;

    // Controlla se l'username esiste già
    const userExists = await collections.findOne({ username });
    if (userExists) {
      return res.status(422).json({ message: "Username già esistente" }); // Risposta in formato JSON
    }

    // Salva l'immagine
    const imgPath = `./static/img/${img.name}`;
    fs.writeFileSync(imgPath, img.data);

    // Inserisci l'utente nel database
    await collections.insertOne({ username, password, img: img.name });

    res.status(200).json({ message: "Registrazione completata con successo" }); // Risposta in formato JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante la registrazione" }); // Risposta in formato JSON
  } finally {
    client.close();
  }
});



app.get('/api/ricerca', async (req, res) => {
  const client = new MongoClient(connectionString);

  try {
    const { ricerca } = req.query;

    if (!ricerca || typeof ricerca !== 'string') {
      return res.status(400).send('Parametro ricerca non valido');
    }

    // Divide la query in parole utilizzando '+' come delimitatore
    const parole = ricerca.split('+');

    // Crea un array di regex per ogni parola
    const regexArray = parole.map(word => new RegExp("\\b" + word + ".*", "i"));

    await client.connect();
    const db = client.db(DB_NAME_VOCI);
    const collection = db.collection('Voci');

    // Costruisce la query per MongoDB utilizzando `$and` e regex
    const results = await collection
      .find({
        $and: regexArray.map(regex => ({ voci: { $regex: regex } })),
      })
      .sort({ nClick: -1 }) // Ordina per nClick in ordine decrescente
      .toArray();

    // Restituisce i risultati trovati
    res.status(200).json({ voci: results });
  } catch (err) {
    console.error('Errore durante la ricerca:', err);
    res.status(500).send('Errore interno del server');
  } finally {
    client.close();
  }
});


app.patch('/api/click', async (req, res) => {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const collections = client.db(DB_NAME_LINK).collection('Link');

    const { id } = req.body;

    if (!id) {
      return res.status(400).send('ID mancante');
    }

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).send('ID non valido');
    }

    const updateResult = await collections.updateOne(
      { _id: objectId },
      { $inc: { nClick: 1 } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).send('Voce non trovata');
    }

    const voce = await collections.findOne({ _id: objectId });

    res.status(200).json({
      links: voce.links || [],
    });
  } catch (err) {
    console.error('Errore durante la richiesta PATCH:', err);
    res.status(500).send('Errore interno del server');
  } finally {
    client.close();
  }
});
