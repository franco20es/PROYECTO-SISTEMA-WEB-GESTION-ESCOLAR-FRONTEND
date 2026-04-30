import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
    constructor() { }

    private API_ASISTENCIA = 'http://localhost:8080/api/asistencia';

    //obtener la asistencia por el codigo del alumno
    getAsistenciaByCodigo(codigo: string) {
        return this.API_ASISTENCIA + '/' + codigo;
    }
}