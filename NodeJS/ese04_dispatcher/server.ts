import fs from 'fs';
let paginaVuota: string;

class Dispatcher {
    prompt: string = ">>>";
    listeners: Object =
        {
            GET: {},
            POST: {},
            PUT: {},
            PATCH: {},
            DELETE: {},
        }

    constructor() {
        init();
    }

    addListener(method : string, resource : string, callback : Function)
    {

    }
}

function init() {
    fs.readFile('static/error.html', function (err, data) {
        if(!err)
        {
            paginaVuota = data.toString();
        }
        else
        {
            paginaVuota = '<h2> Risorsa non trovata </h2>'
        }
    })
}