'use strict';

module.exports = class ResultadoParseo {
  constructor(
    status,
    legislatura,
    sesion,
    votaciones
  ) {
    this.status = status;
    this.legislatura = legislatura;
    this.sesion = sesion;
    this.votaciones = votaciones;
  }
}