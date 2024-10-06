import fs from 'fs';
import url from 'url';
import mime from 'mime-types';

let paginaVuota: string;    

class Dispatcher {
    private paginaErrore: string = '';
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

        console.log(`${this.prompt}${method}: ${resource}`);

        // Controlla se esiste un listener per la rotta
        if (this.listeners[method] && this.listeners[method][resource]) {
            this.listeners[method][resource](req, res); // Chiama il callback associato alla rotta
        } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("Risorsa non trovata!");
            res.end();
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
}

export default new Dispatcher();
