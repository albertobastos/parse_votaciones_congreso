'use strict';

const request = require('request');
const parser = require('./parser.js');
const status = require('./resultado-status.js');
const utils = require('./utils');


const SESION_URL = 'http://www.congreso.es/portal/page/portal/Congreso/Congreso/Actualidad/Votaciones';
const PATTERN =/\"(https:\/\/app.congreso.es\/votacionesWeb\/OpenData?.*\")/g;

const generateOptions = (url) => ({
    url,
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36",
    }
})


function getLastVotation() {
    // https://app.congreso.es/votacionesWeb/OpenData?sesion=176&completa=1&legislatura=12
    request(generateOptions(SESION_URL), (err, response, body) => {
        if (err || !response || response.statusCode !== 200 || !body || !body.length) return console.error(err);

        const urls = body.match(PATTERN);
        if (urls.length) {
            const VOTACIONES_URL = body.match(PATTERN)[0].replace(/\"/g, '');
            console.log("Tenemos URL del XML", VOTACIONES_URL);

            const session = utils.getParam(VOTACIONES_URL, 'sesion');
            const legislatura = utils.getParam(VOTACIONES_URL, 'legislatura');
            const completa = utils.getParam(VOTACIONES_URL, 'completa');

            console.log("Session", session)
            console.log("Legislatura", legislatura)
            console.log("Completa", completa)

            let resultado = parser.parsear_sesion(legislatura, session).then(resultado => {
                if (resultado && resultado.status === status.OK) {
                    resultado.save();
                }    
            });
        }
    });
}

module.exports = {
    getLastVotation
}

getLastVotation();