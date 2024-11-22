import { MongoClient, ObjectId, UpdateFilter, Document } from 'mongodb';

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
			'piloti.nome': { $regex: /.*(Antonio Giovinazzi).*/ }
		};
		const projection = {
			scuderia: 1,
			motore: 1,
			pneumatici: 1,
			'piloti.nome': 1,
			_id: 0
		};
		const request = collection.find(filter).project(projection).sort({ scuderia: 1 }).toArray();
		request.catch((err) => console.log(`Errore: ${err.message}`));
		request.then((data) => console.log(`Query2: ${JSON.stringify(data, null, 3)}`));
		request.finally(() => client.close());
	} catch (err) {
		console.log(`Errore: ${err.message}`);
	}
}


async function query4() {
	const client = new MongoClient(connectionString);
	await client.connect().catch(() => console.log('Errore connessione al db'));
	const collection = client.db(DB_NAME).collection('Piloti');

	try {
		const filter = { 'piloti.nome': { $regex: /Verstappen/ }, scuderia: 'Red Bull' };
		const update = { $inc: { 'piloti.$.punti': 10 } };
		const request = collection.updateOne(filter, update);
		request.catch((err) => console.log(`Errore: ${err.message}`));
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
		const filter = { 'piloti.nazione': 'Regno Unito', 'piloti.punti': { $gt: 10 } };
		const projection = { 'piloti.nome': 1, scuderia: 1, 'piloti.punti': 1, _id: 0 };
		const request = collection.find(filter).project(projection).sort({ 'piloti.punti': -1 }).toArray();
		request.catch((err) => console.log(`Errore: ${err.message}`));
		request.then((data) => console.log(`Query5: ${JSON.stringify(data, null, 3)}`));
		request.finally(() => client.close());
	} catch (err) {
		console.log(`Errore: ${err.message}`);
	}
}

