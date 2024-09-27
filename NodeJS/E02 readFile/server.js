import http from "http";
import url from "url";
import fs from "fs";
import mime from "mime";
import headers from "./headers.json" assert { type: "json" };

const PORT = 1337;

// Funzione per gestire le risorse statiche
function handleStaticResource(resource, res) {
  resource = `./static${resource}`; // La risorsa viene cercata nella cartella 'static'

  fs.readFile(resource, function (err, data) {
    if (!err) {
      let header = { "Content-Type": mime.getType(resource) }; // Mime type dinamico
      res.writeHead(200, header);
      res.write(data);
      res.end();
    } else {
      // Se non trova la risorsa, manda la pagina di errore
      fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
          res.writeHead(404, headers.html);
          res.write(data);
        } else {
          res.writeHead(404, headers.text);
          res.write("Pagina di errore non trovata!");
        }
        res.end();
      });
    }
  });
}

// Funzione per gestire le risorse dinamiche
function handleDynamicResource(resource, params, res) {
  if (resource === "/api/servizio1") {
    // Gestisci la richiesta per servizio1
    res.writeHead(200, headers.json); // Imposta il tipo di contenuto JSON
    const responseData = {
      message: "Risposta dal servizio 1",
      params: params, // Puoi includere parametri se necessario
    };
    res.write(JSON.stringify(responseData));
    res.end();
  }else if (resource === "/api/servizio2")
  {
    res.writeHead(200, headers.json); // Imposta il tipo di contenuto JSON
    const responseData = {
      message: "Risposta dal servizio 2",
      params: params, 
    };
    res.write(JSON.stringify(responseData));
    res.end();
  }
  else {
    // Se non trova la risorsa API, manda errore 404
    res.writeHead(404, headers.text);
    res.write("Risorsa dinamica non trovata!");
    res.end();
  }
}

// Crea il server HTTP
const server = http.createServer(function (req, res) {
  let { method } = req;
  let fullPath = url.parse(req.url, true);
  let resource = fullPath.pathname;
  //legge solo i parametri get
  let params = fullPath.query;

  console.log(`Richiesta ${method}: ${resource}`);

  // Se la risorsa è "/" reindirizza su "/index.html"
  if (resource == "/") {
    resource = "/index.html";
  }

  // Gestione delle risorse
  if (!resource.startsWith("/api/")) {
    handleStaticResource(resource, res); // Gestione delle risorse statiche
  } else {
    handleDynamicResource(resource, params, res); // Gestione delle risorse dinamiche
  }
});

server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);
