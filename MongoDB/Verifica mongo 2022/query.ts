import { MongoClient, ObjectId } from 'mongodb';
const connectionString = 'mongodb://localhost:27017/';
const DB_NAME = 'Valutazioni';

query1();
query2();
query3();
query4();
query5();


async function query1() {
    const client = new MongoClient(connectionString);
    await client.connect();
    const collection = client.db(DB_NAME).collection('Valutazioni');
  
    const filter = {
        classe: { $regex: /^5/ }, // Corrisponde a tutte le classi di 5°
        assenze: { $gt: 10 }
    };
    const projection = {
        nome: 1,
        classe: 1,
        assenze: 1
    };
  
    const result = await collection.find(filter).project(projection).toArray();
    console.log('Query 1 (Studenti di 5° con più di 10 assenze):', result);
    client.close();
}

async function query2() {
    const client = new MongoClient(connectionString);
    await client.connect();
    const collection = client.db(DB_NAME).collection('Valutazioni');
  
    const projection = {
        nome: 1,
        classe: 1,
        assenze: 1
    };
  
    const result = await collection.find().project(projection).sort({ assenze: -1 }).limit(3).toArray();
    console.log('Query 2 (Top 3 studenti con più assenze):', result);
    client.close();
}

async function query3() {
    const client = new MongoClient(connectionString);
    await client.connect();
    const collection = client.db(DB_NAME).collection('Valutazioni');
  
    const filter = {
        nome: 'Flaminia',
        classe: '5A'
    };
    const update = {
        $inc: { assenze: 1 }
    };
  
    const result = await collection.updateOne(filter, update);
    console.log('Query 3 (Incrementa assenze per Flaminia):', result);
    client.close();
}

async function query4() {
    const client = new MongoClient(connectionString);
    await client.connect();
    const collection = client.db(DB_NAME).collection('Valutazioni');
  
    const filter = {
        classe: { $regex: /^5/ },
        "valutazioni": { $elemMatch: { disciplina: "informatica", voto: 9 } }
    };
    const projection = {
        nome: 1,
        classe: 1,
        "valutazioni.$": 1 // Proietta solo la valutazione che corrisponde al filtro
    };
  
    const result = await collection.find(filter).project(projection).toArray();
    console.log('Query 4 (Studenti di 5° con voto 9 in informatica):', result);
    client.close();
}

async function query5() {
    const client = new MongoClient(connectionString);
    await client.connect();
    const collection = client.db(DB_NAME).collection('Valutazioni');
  
    const filter = {
        nome: 'Piero',
        classe: '4A'
    };
    const update = {
        $push: {
            valutazioni: {
                disciplina: 'informatica',
                voto: 7,
                data: new Date()
            }
        }
    };
  
    const result = await collection.updateOne(filter, update);
    console.log('Query 5 (Aggiungi voto 7 in informatica per Piero):', result);
    client.close();
}
