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

app.post('/api/login', cors(corsOptions), async (req, res) => {
  const client: MongoClient = new MongoClient(connectionString);
  await client.connect();
  const collections = client.db(DB_NAME).collection('Mail');
  const user: { username: string; password: string } = req.body;
  const result = await collections.findOne<{ username: string; password: string }>({ username: user.username, password: user.password });
  if (result) {
    
    res.status(200).send(result);
  } else {
    res.status(401).send('Invalid credentials');
  }
  client.close();
});

app.post('/api/sendMail', async (req, res) => {
  const { from, to, subject, body } = req.body;
  const { attachment } = req.files; // File inviato come parte della richiesta

  if (!from || !to || !subject || !body) {
    return res.status(400).send('Campi obbligatori mancanti');
  }

  // Salvataggio del file
  const filePath = './static/img/' + attachment.name;
  fs.writeFile(filePath, attachment.data, async function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }

    const newMail = {
      from,
      to,
      subject,
      body,
      attachment: attachment.name, // Percorso relativo del file
      timestamp: new Date(),
    };

    const client = new MongoClient(connectionString);
    await client.connect().catch((err) => {
      return res.status(503).send("Errore: connessione al database non riuscita");
    });

    const collections = client.db(DB_NAME).collection('Mail');
    collections
      .updateOne(
        { username: to },
        { $push: { mail: newMail } }
      )
      .then((data) => {
        res.status(200).send({ message: 'Mail inviata con successo', mail: newMail });
      })
      .catch((err) => {
        res.status(500).send('Errore durante l\'aggiornamento del database: ' + err.message);
      })
      .finally(() => {
        client.close();
      });
  });
});
