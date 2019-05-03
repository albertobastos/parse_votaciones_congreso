const parser = require('./parser.js');
const status = require('./resultado-status.js');
const fs = require('fs');


const LEGISLATURA_ACTUAL = 12;
const ULTIMA_SESION_PROCESADA = 175;

async function run() {
  let resultado = await parser.parsear_sesion(LEGISLATURA_ACTUAL, ULTIMA_SESION_PROCESADA + 1);
  if (resultado.status === status.NOT_FOUND) {
    // si no hemos encontrado sesión siguiente, quizás se haya iniciado una nueva legislatura...
    resultado = await parser.parsear_sesion(LEGISLATURA_ACTUAL + 1, 1);
  }
  if (resultado && resultado.status === 0) {
    resultado.save();
  }  
  console.log('Resultado:\n\n', JSON.stringify(resultado, null, 4));
  return resultado;
}

run();