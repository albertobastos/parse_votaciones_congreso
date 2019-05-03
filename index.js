const parser = require('./parser.js');
const status = require('./resultado-status.js');

const LEGISLATURA_ACTUAL = 12;
const ULTIMA_SESION_PROCESADA = 175;

let resultado = parser.parsear_sesion(LEGISLATURA_ACTUAL, ULTIMA_SESION_PROCESADA + 1);
if (resultado.status === status.NOT_FOUND) {
  // si no hemos encontrado sesión siguiente, quizás se haya iniciado una nueva legislatura...
  resultado = parser.parsear_sesion(LEGISLATURA_ACTUAL + 1, 1);
}

console.log('Resultado:\n\n', JSON.stringify(resultado, null, 4));