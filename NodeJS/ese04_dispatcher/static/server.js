var prototype = require('events').prototype;
var http = require('http');
var hostname = require('os').hostname;
var send = require('process').send;
var url = require('url');
var PORT = 1337;
var PORT4 = 2223;
var server = http.createServer(function (req, res) {
    var method = req.method;
    var fullPath = url.parse(req.url, true); // il true consente di parsificare i parametri  altrimenti sarebbero restituiti come stringa
    var resource = fullPath.pathname;
    var params = fullPath.query;
    var domain = req.headers.host;
    console.log('Richiesta ricevuta : ${resource}');
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write('<h1>Informazioni relative alla richiesta ricevuta </h1>');
    res.write('<br>');
    res.write('<br>');
    res.write("<p> Nome Del Dominio : ".concat(domain, "</p>"));
    res.write("<p> Metodo Della Richiesta : ".concat(method, "</p>"));
    res.write("<p> Risorsa Richiesta : ".concat(resource, "</p>"));
    res.write("<p> Parametri : ".concat(JSON.stringify(params), "</p>"));
});
//Se non si specifica l'indirizzo IP il server viene avviato
//su tutte le interfacce disponibili
server.listen(PORT);
console.log("Server in ascolto sula porta : ".concat(PORT));
