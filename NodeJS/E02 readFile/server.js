import http from 'http';
import url from 'url';
import fs from 'fs';
import mime from 'mime';
import headers from './headers.json';

const PORT = 1337;

const server = http.createServer(function (req, res) {
  let { method } = req;
  let fullPath = url.parse(req.url, true);
  let resource = fullPath.pathname;
  let params = fullPath.query;

  console.log(`Richiesta ${method}: ${resource}`);

  if (resource == '/') {
    resource = '/index.html';
  }

  if (!resource.startsWith('/api/')) {
    resource = `./static${resource}`;
    fs.readFile(resource, function (err, data) {
      if (!err) {
        let header = { 'Content-Type': mime.getType(resource) };
        res.writeHead(200, header);
        res.write(data);
        res.end();
      } else {
        res.writeHead(404, headers.text);
        res.write('Risorsa non trovata!');
        res.end();
      }
    });
  }
});

server.listen(PORT);
console.log(`Server in ascolto sulla porta: ${PORT}`);
