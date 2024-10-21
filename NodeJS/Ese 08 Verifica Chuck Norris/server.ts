import * as http from 'http';
import dispatcher from './dispatcher';
import headers from './headers.json';
import fs from 'fs';
import factsJson from './facts.json'; // Assicurati che questo sia un array
import { setEngine } from 'crypto';
const crypto = require('crypto');

const PORT = 1337;
const icon_url = "https://assets.chucknorris.host/img/avatar/chuck-norris.png";
const api_url = "https://api.chucknorris.io"

// Funzione per formattare i dati delle radio
function formatFactData(factsJson: any[]) {
  return factsJson.map(fact => ({
    id: fact.id,
    value: fact.value
  }));
} 

// Funzione per scrivere file JSON
function writeJsonFile(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Funzione per aggiornare il conteggio delle stazioni
function updateStationCount(states: any[], radios: any[]) {
  // Resetta il conteggio delle stazioni per ogni stato
  states.forEach(state => {
    state.stationcount = 0;
  });

  // Conta quante stazioni appartengono a ciascuno stato
  radios.forEach(radio => {
    const stateFound = states.find(state => state.name === radio.state);
    if (stateFound) {
      stateFound.stationcount++; // Incrementa il conteggio per la regione trovata
    }
  });

  return states;
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

// Listener per /api/elenco, restituisce l'elenco aggiornato degli stati
dispatcher.addListener('GET', '/api/categories', function (req: any, res: any) {
  let categories: string[] = [];

  // Itera attraverso i facts e aggiungi tutte le categorie
  factsJson.facts.forEach(fact => {
    fact.categories.forEach(category => {
      categories.push(category); // Aggiungi ogni singola categoria all'array
    });
  });

  // Rimuovi i duplicati usando un Set
  let NoDuplicatesVector: string[] = [...new Set(categories)];

  // Invia la risposta con l'array delle categorie uniche
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(NoDuplicatesVector));
  res.end();
});

dispatcher.addListener('POST', '/api/facts', function (req, res) {
  const { selectedCategory } = req['BODY'];
  let formattedVectorFacts: { value: string; score: number; id: string }[] = [];
  
  factsJson.facts.forEach(singleFact => {
    
    singleFact.categories.forEach(categoriaAttuale => {
    
      if (categoriaAttuale === selectedCategory) {
       
        formattedVectorFacts.push({
          value: singleFact.value,       
          score: singleFact.score,       
          id: singleFact.id              
        });
      }
    });
  });

  formattedVectorFacts.sort((a,b) => b.score - a.score)
  
  res.writeHead(200, headers.json);
  res.write(JSON.stringify(formattedVectorFacts));
  res.end();
});

dispatcher.addListener('POST', '/api/rate', function (req, res) {
  
  let ids = req['BODY'].selectedIds;
  const idsVector: any[] = [];
  ids.forEach(element => {
    idsVector.push(element)
  });
  
  console.log('Gli ID Sono : ', ids);

  factsJson.facts.forEach(firstElement => {
      if(idsVector.includes(firstElement.id))
      {
         firstElement.score++
         console.log("ID: " + firstElement.id + "Nuovo Score: " + firstElement.score)
      }
  });
  // Salva la struttura aggiornata su file
  fs.writeFile('facts.json', JSON.stringify(factsJson, null, 2), (err) => {
      if (err) {
          console.error('Errore durante il salvataggio dei fatti:', err);
          res.writeHead(500, headers.json);
          res.write(JSON.stringify('Errore interno del server'));
          res.end();
          return;
      }
      // Rispondi con un messaggio di "OK"
      res.writeHead(200, headers.json);
      res.write(JSON.stringify('Like Aggiunto!'));
      res.end();
  });
});

dispatcher.addListener('POST', '/api/add', function (req, res) {
  
  let data = req['BODY'];
  if(!Array.isArray(data))
  {
    data = [data];
  }

  console.log('Qia motren : ' + JSON.stringify(data))
  let formattedVectorData: { 
    value: string, 
    score: number, 
    created_at: string, 
    updated_at: string, 
    icon_url: string, 
    url: string, 
    id: string 
  }[] = [];


    let dataAttuale = new Date().toISOString();
    let dataAggiornamento = new Date().toISOString();

  data.forEach(element => {
    formattedVectorData.push({
        value: element.factValue,
        score: 0,
        created_at: dataAttuale,
        updated_at: dataAggiornamento,
        icon_url: icon_url || "",
        url: api_url || "",
        id: element.id || generateUniqueId()
    });

    res.writeHead(200, headers.json);
      res.write(JSON.stringify(formattedVectorData));
      res.end(); 
});
});
function generateUniqueId() {
  let id;
  let isUnique = false;

  // Rigenera finché non troviamo un ID unico
  while (!isUnique) {
      id = crypto.randomBytes(16).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').substring(0, 22); // Genera un ID base64 di 22 caratteri

      // Verifica se l'ID esiste già nel JSON dei fatti
      isUnique = !factsJson.facts.some(fact => fact.id === id);
  }

  return id;
}