import http from 'http';
import dispatcher from './dispatcher' //con typescript non si mette l'estensione del file
import headers from './static/headers.json'

const PORT = 1337 //La porta di NODE

const server = http.createServer(function(req, res){ //questa function di callback viene richiamata quando arriva una richiesta client

});

server.listen(PORT, function()
{
    console.log('Server in ascolto sulla porta : ' + PORT);
})

/***  Registrazione dei listener ***/

dispatcher.addListener('GET', '/api/servizio2', function(req, res){
    res.writeHead(200, headers.json)
    res.write(JSON.stringify('Benvenuto'))
    res.end()
})


dispatcher.addListener('POST', '/api/servizio2', function(req, res){
    res.writeHead(200, headers.json)
    res.write(JSON.stringify('Benvenuto'))
    res.end()
})