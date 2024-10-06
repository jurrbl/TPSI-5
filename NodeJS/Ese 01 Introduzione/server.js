const { prototype } = require('events');
const http = require('http');
const { hostname } = require('os');
const { send } = require('process');
const url = require('url')

const PORT = 1337

const server = http.createServer(function(req, res)
{
    let method = req.method;
    let fullPath = url.parse(req.url, true) // il true consente di parsificare i parametri  altrimenti sarebbero restituiti come stringa

    let resource = fullPath.pathname;
    let params = fullPath.query;

    let domain = req.headers.host;  

    console.log('Richiesta ricevuta : ${resource}');

    res.writeHead(200,{"Content-Type": "text/html;charset=utf-8" });

    res.write('<h1>Informazioni relative alla richiesta ricevuta </h1>')
    res.write('<br>')
    res.write('<br>')
    res.write(`<p> Nome Del Dominio : ${domain}</p>`)
    res.write(`<p> Metodo Della Richiesta : ${method}</p>`);
    res.write(`<p> Risorsa Richiesta : ${resource}</p>`);
    res.write(`<p> Parametri : ${JSON.stringify(params)}</p>`);

});

//Se non si specifica l'indirizzo IP il server viene avviato
//su tutte le interfacce disponibili

server.listen(PORT)
console.log(`Server in ascolto sula porta : ${PORT}`)
