const Resultado = require('./resultado.js');
const status = require('./resultado-status.js');

module.exports = {
  parsear_sesion: (legislatura, sesion) => {
    return new Resultado(status.NOT_FOUND, legislatura, sesion, []);
  }
}