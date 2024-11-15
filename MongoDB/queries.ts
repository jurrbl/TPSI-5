import { MongoClient } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'Unicorns';

query1();
query2();

async function query1() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    weight: { $gte: 700, $lte: 800 },
  };
  const projection = {
    name: 1,
    weight: 1,
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(Errore: ${err.message});
  });
  request.then(function (data) {
    console.log(Query1: ${JSON.stringify(data, null, 3)});
  });
  request.finally(function () {
    client.close();
  });
}

async function query2() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(function () {
    console.log('Errore connessione al db');
  });
  const collection = client.db(DB_NAME).collection('Unicorns');

  const filter = {
    gender: 'm',
    loves: 'grape',
    vampires: { $gt: 60 },
  };
  const projection = {
    _id: 0,
    name: 1,
    gender: 1,
    loves: 1,
    vampires: 1,
  };
  const request = collection.find(filter).project(projection).toArray();
  request.catch(function (err: Error) {
    console.log(Errore: ${err.message});
  });
  request.then(function (data) {
    console.log(Query2: ${JSON.stringify(data, null, 3)});
  });
  request.finally(function () {
    client.close();
  });
}