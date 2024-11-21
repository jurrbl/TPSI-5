import { MongoClient, ObjectId } from 'mongodb';

const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'Piloti';

// Esegui una query alla volta decommentando la chiamata
//query1();
//query2();
//query3();
//query4();
query5();

async function query1() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(() => console.log('Errore connessione al db'));
  const collection = client.db(DB_NAME).collection('Piloti');

  try {
    const filter = { pneumatici: { $ne: 'Pirelli' } }; // Filtra scuderie senza pneumatici Pirelli
    const projection = { scuderia: 1, pneumatici: 1, _id: 0 }; // Mostra solo scuderia e pneumatici
    const request = collection.find(filter).project(projection).sort({ scuderia: 1 }).toArray();
    request.catch((err: Error) => console.log(`Errore: ${err.message}`));
    request.then((data) => console.log(`Query1: ${JSON.stringify(data, null, 3)}`));
    request.finally(() => client.close());
  } catch (err) {
    console.log(`Errore: ${err.message}`);
  }
}

async function query2() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(() => console.log('Errore connessione al db'));
  const collection = client.db(DB_NAME).collection('Piloti');

  try {
    const filter = {
      motore: 'Ferrari',
      pneumatici: 'Pirelli',
      'piloti.nazione': 'Italia',
    };
    const projection = { scuderia: 1, pneumatici: 1, motore: 1, 'piloti.$': 1, _id: 0 };
    const request = collection.find(filter).project(projection).sort({ scuderia: 1 }).toArray();
    request.catch((err: Error) => console.log(`Errore: ${err.message}`));
    request.then((data) => console.log(`Query2: ${JSON.stringify(data, null, 3)}`));
    request.finally(() => client.close());
  } catch (err) {
    console.log(`Errore: ${err.message}`);
  }
}


async function query3() {
    const client = new MongoClient(connectionString);
    await client.connect().catch(function(err:Error){
        console.log('errore connessione al database server: ',err.message)
    })
    const collection = client.db(DB_NAME).collection('Piloti')
 
    let rq = collection.find({motore:'Ferrari', pneumatici:'Pirelli', 'piloti.nazione':'Italia'}).project({scuderia:1, motore:1, pneumatici:1, 'piloti.nome.$':1, _id:0}).toArray()
    rq.catch(function(err:Error){
        console.log('errore: ',err.message)
    })
    rq.then(function(data){
        console.log("Query3:\n"+JSON.stringify(data, null, 3)+"\nEnd\n")
    })
    rq.finally(function(){
        client.close()
    })
}

async function query4() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(() => console.log('Errore connessione al db'));
  const collection = client.db(DB_NAME).collection('Piloti');

  try {
    const filter = { scuderia: { $regex: /Red Bull/i }, 'piloti.nome': { $regex: /Verstappen/i } };
    const projection = { scuderia: 1, 'piloti.nome': 1, 'piloti.punti': 1, _id: 0 };
    const request = collection.find(filter).project(projection).sort({ scuderia: 1 }).toArray();
    request.catch((err: Error) => console.log(`Errore: ${err.message}`));
    request.then((data) => console.log(`Query4: ${JSON.stringify(data, null, 3)}`));
    request.finally(() => client.close());
  } catch (err) {
    console.log(`Errore: ${err.message}`);
  }
}

async function query5() {
  const client = new MongoClient(connectionString);
  await client.connect().catch(() => console.log('Errore connessione al db'));
  const collection = client.db(DB_NAME).collection('Piloti');

  try {
    const filter = { 'piloti': { $elemMatch: { nazione: 'Regno Unito', punti: { $gt: 10 } } } };
    const projection = { scuderia: 1, 'piloti.nome': 1, 'piloti.punti': 1, _id: 0 };
    const request = collection.find(filter).project(projection).sort({ scuderia: 1 }).toArray();
    request.catch((err: Error) => console.log(`Errore: ${err.message}`));
    request.then((data) => console.log(`Query5: ${JSON.stringify(data, null, 3)}`));
    request.finally(() => client.close());
  } catch (err) {
    console.log(`Errore: ${err.message}`);
  }
}
