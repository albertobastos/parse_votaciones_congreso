const request = require('request');
const unzipper = require('unzipper');
const xml2js = require('xml2js');

const { Resultado, ResultadoVotacion, ResultadoGrupo } = require('./resultado.js');
const status = require('./resultado-status.js');

module.exports = {
  parsear_sesion
};

async function parsear_sesion(legislatura, sesion) {
  return new Promise((resolve, reject) => {
    const url = `https://app.congreso.es/votacionesWeb/OpenData?completa=1&legislatura=${legislatura}&sesion=${sesion}`;

    request({
      url,
      method: 'GET',
      encoding: null // enforce Buffer body for expected binary data
    }, async function (error, response, body) {
      if (error) {
        resolve(new Resultado(status.ERROR, legislatura, sesion, null));
        return;
      }

      if (response && response.statusCode !== 200) {
        resolve(new Resultado(status.ERROR, legislatura, sesion, null));
        return;
      }

      if (!body || !body.length) {
        resolve(new Resultado(status.NOT_FOUND, legislatura, sesion, null));
        return;
      }

      let buffer_votaciones
      try {
        buffer_votaciones = await extraerZipVotaciones(body);
      } catch (err) {
        console.log(err);
        resolve(new Resultado(status.ERROR, legislatura, sesion, null));
        return;
      }

      let votaciones;
      try {
        votaciones = await Promise.all(buffer_votaciones.map(buffer_votacion => parsearXmlVotacion(buffer_votacion)));
      } catch (err) {
        console.log(err);
        resolve(new Resultado(status.ERROR, legislatura, sesion, null));
        return;
      }

      resolve(new Resultado(status.OK, legislatura, sesion, votaciones));
    });
  });
}

async function extraerZipVotaciones(zip_buffer) {
  const zip_contents = await unzipper.Open.buffer(zip_buffer);
  return Promise.all(zip_contents.files.map(file => file.buffer()));
}

async function parsearXmlVotacion(votacion_buffer) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(votacion_buffer.toString('latin1'), (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        let votacion = construirObjetoVotacion(result);
        resolve(votacion);
      } catch (err) {
        reject(err);
      }
    });
  })
}

function construirObjetoVotacion(votacion_xml2js) {
  const Resultado = votacion_xml2js.Resultado;
  const { Informacion, Votaciones } = Resultado;
  const { NumeroVotacion, Fecha, Titulo, TextoExpediente } = Informacion[0];
  const { Votacion } = Votaciones[0];

  const grupos = construirObjetoGrupos(Votacion);

  return new ResultadoVotacion(Fecha, Number(NumeroVotacion), Titulo, TextoExpediente, grupos);
}

function construirObjetoGrupos(votacion_obj) {
  // agrupar: byGrupoTipoVoto[grupo][tipoVoto] = número de votos de ese tipo para ese grupo
  const byGrupoTipoVoto = votacion_obj.reduce((acc, voto_obj) => {
    let grupo = voto_obj.Grupo[0];
    let voto = voto_obj.Voto[0];
    acc[grupo] = acc[grupo] || {};
    acc[grupo][voto] = acc[grupo][voto] || 0;
    acc[grupo][voto]++;
    return acc;
  }, {});

  // nos quedamos con el tipo de grupo más votado para cada uno
  const grupos = Object.keys(byGrupoTipoVoto).map(grupo => {
    const votos = byGrupoTipoVoto[grupo];
    const tipoMasVotado = Object.keys(votos).reduce((winner, voto) => votos[winner] > votos[voto] ? winner : voto);
    return new ResultadoGrupo(grupo, tipoMasVotado);
  });

  return grupos;
}