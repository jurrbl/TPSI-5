import fs from 'fs';
import url from 'url';
import mime from 'mime';
import headers from './headers.json';


class Dispatcher {
    private paginaErrore: string;
    private prompt: string = '>>> ';
    private listeners: Object = {
        GET: {
            // '/orario': function() {},
            // '/elencoStudenti': function() {},
        },
        POST: {},
        PUT: {},
        PATCH: {},
        DELETE: {}
    };

    constructor() {
        this.init();
    }

    public addListener(method: string, resource: string, callback: Function) {
        if (!method || !resource || !callback) {
            return;
        }
        method = method.toUpperCase();
        if (method in this.listeners) {
            this.listeners[method][resource] = callback;
            console.log(`Successfully registered method: ${method}, resource: ${resource}`);
        }
        else {
            throw new Error('Invalid HTTP method');
        }
    }

    private innerDispatch(req: any, res: any) {
        let method = req.method.toUpperCase();
        let fullPath = url.parse(req.url, true);
        let resource = fullPath.pathname;
        let params = fullPath.query;

        console.log(`${this.prompt}${method}:${resource}, params:${JSON.stringify(params)}`);

        // Gestione dei parametri
        req['GET'] = params;
        if(req['BODY']) {
            console.log(`   Parametri ${method}:${JSON.stringify(req['BODY'])}`);
        }


        if (!resource?.startsWith('/api/')) {
            this.staticListener(req, res, resource);
        }
        else {
            if (method in this.listeners && resource in this.listeners[method]) {
                const callback = this.listeners[method][resource];
                callback(req, res);
            }
            else {
                res.writeHead(404, headers.text);
                res.write('Servizio non disponibile');
                res.end();
            }
        }
    }

    public dispatch(req, res) {
        let method = req.method.toUpperCase();
        if (method == 'GET') {
            this.innerDispatch(req, res);
        }
        else {
            // L'evento on data viene richiamato ogni volta che arrivano parametri nel body dal client
            let params = '';
            let jsonParams;
            req.on('data', function (data) {
                params += data;
            });
            // L'evento on end viene richiamato in corrispondenza della fine dei parametri nel body
            req.on('end', () => {
                try {
                    jsonParams = JSON.parse(params);
                } catch (err) {
                    console.log('Parametri POST ignorati perchè in formato non valido');
                }
                if(Object.keys(jsonParams).length > 0) {
                    req['BODY'] = jsonParams;
                }
                this.innerDispatch(req, res);
            });
        }
    }

    private init() {
        fs.readFile('static/error.html', (err, data) => {
            if (!err) {
                this.paginaErrore = data.toString();
            }
            else {
                this.paginaErrore = '<h2>Risorsa non trovata</h2>';
            }
        })
    }

    private staticListener(req, res, resource) {
        if (resource == '/') {
            resource = '/index.html';
        }

        let fileName = `./static${resource}`;
        fs.readFile(fileName, (err, data) => {
            if (!err) {
                let header = { 'Content-Type': mime.getType(fileName) };
                res.writeHead(200, header);
                res.write(data);
                res.end();
            }
            else {
                res.writeHead(404, headers.html);
                res.write(this.paginaErrore);
                res.end();
            }
        });
    }
}



export default new Dispatcher();