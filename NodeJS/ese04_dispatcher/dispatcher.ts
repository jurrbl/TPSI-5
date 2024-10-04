import fs from 'fs';
import url from 'url';
import mime from 'mime-types'; // Assicura che `mime-types` sia installato (npm install mime-types)

let paginaVuota: string;    

class Dispatcher {
    private paginaErrore: string = ''; // Inizializza con stringa vuota
    private prompt: string = ">>>";
    private listeners: Object = {
        GET: {},
        POST: {},
        PUT: {},
        PATCH: {},
        DELETE: {},
    };

    constructor() {
        this.init();
    }

    addListener(method: string, resource: string, callback: Function) {
        if (!method || !resource || !callback) {
            return;
        }
        method = method.toUpperCase();
        if (this.listeners.hasOwnProperty(method)) {
            this.listeners[method][resource] = callback;
            console.log('Successfully registered method: ' + method + " resource: " + resource);
        } else {
            throw new Error('Invalid HTTP Method');
        }
    }

    dispatch(req: any, res: any) {
        let method = req.method.toUpperCase();
        let fullPath = url.parse(req.url, true);
        let resource = fullPath.pathname;
        let params = fullPath.query;

        console.log(`${this.prompt}${method}: ${resource} params: ${JSON.stringify(params)}`);

        if (!resource?.startsWith("/api/")) {
            this.handleStaticResource(resource, res); // Usa `this` per le funzioni di classe
        } else {
            this.handleDynamicResource(resource, params, res); // Usa `this`
        }
    }

    init() {
        fs.readFile('static/error.html', (err, data) => {
            if (!err) {
                paginaVuota = data.toString();
            } else {
                paginaVuota = '<h2> Risorsa non trovata </h2>';
            }
        });
    }

    // Funzione per gestire le risorse statiche
    private handleStaticResource(resource: string, res: any) {
        resource = `./static${resource}`; // La risorsa viene cercata nella cartella 'static'

        fs.readFile(resource, (err, data) => {
            if (!err) {
                let header = { "Content-Type": mime.lookup(resource) || "text/plain" }; // Mime type dinamico
                res.writeHead(200, header);
                res.write(data);
                res.end();
            } else {
                // Se non trova la risorsa, manda la pagina di errore
                res.writeHead(404, { "Content-Type": "text/html" });
                res.write(paginaVuota);
                res.end();
            }
        });
    }

    // Funzione per gestire le risorse dinamiche
    private handleDynamicResource(resource: string, params: any, res: any) {
        if (resource === "/api/servizio1") {
            res.writeHead(200, { "Content-Type": "application/json" });
            const responseData = {
                message: "Risposta dal servizio 1",
                params: params,
            };
            res.write(JSON.stringify(responseData));
            res.end();
        } else if (resource === "/api/servizio2") {
            res.writeHead(200, { "Content-Type": "application/json" });
            const responseData = {
                message: "Risposta dal servizio 2",
                params: params,
            };
            res.write(JSON.stringify(responseData));
            res.end();
        } else {
            // Se non trova la risorsa API, manda errore 404
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("Risorsa dinamica non trovata!");
            res.end();
        }
    }
}

export default new Dispatcher(); // Crea un'istanza della classe Dispatcher e la esporta come default
