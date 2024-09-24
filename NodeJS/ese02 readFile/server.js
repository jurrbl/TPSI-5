const http = require('http');
const fs = require('fs')
import mime from 'mime';
const url = require('url');
const headers = require('./headers.json')

const PORT = 1337

//createServer viene eseguita ogni volta che arriva una richiesta dal client
const server = http.createServer(function (req, res) {
    let method = req.method;
    let fullPath = url.parse(req.url, true) // il true consente di parsificare i parametri  altrimenti sarebbero restituiti come stringa

    let resource = fullPath.pathname;
    let params = fullPath.query;



    console.log(`Richiesta ${method} : ${resource}`);

    if (resource == '/') {
        resource = `/index.html`;
    }

    if (resource.startsWith('/api')) {
        resource = `./static${resource}`
        fs.readfile(resource, function (err, data) {
            if(!err)
            {
                let header = {'Content-Type': mime.getType(resource)}
                res.writeHead(200)
                res.write(data)
                res.end()
            }
            else
            {
                res.writeHead(404, headers.text)
                res.write('Risorsa non trovata!');
                res.end()
            }
        })
    }

    res.writeHead(200, {
        "Content-Type": "text/html;charset=utf-8"
    });

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