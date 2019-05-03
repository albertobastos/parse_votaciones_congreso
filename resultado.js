'use strict';

class Resultado {
  constructor(
    status,
    legislatura,
    sesion,
    votaciones // ResultadoVotacion[]
  ) {
    this.status = status;
    this.legislatura = legislatura;
    this.sesion = sesion;
    this.votaciones = votaciones || [];
  }
};

class ResultadoVotacion {
  constructor(
    fecha,
    numero,
    titulo,
    texto,
    grupos // ResultadoGrupo[]
  ) {
    this.fecha = fecha;
    this.numero = numero;
    this.titulo = titulo;
    this.texto = texto;
    this.grupos = grupos || [];
  }

  toString() {
    return `Fecha: ${this.fecha}, Numero: ${this.numero}`;
  }
};

class ResultadoGrupo {
  constructor(
    grupo,
    voto // TipoVoto
  ) {
    this.grupo = grupo;
    this.voto = voto;
  }

  toString() {
    return `Grupo: ${this.grupo}, Voto: ${this.voto}`;
  }
}

module.exports = { Resultado, ResultadoVotacion, ResultadoGrupo };