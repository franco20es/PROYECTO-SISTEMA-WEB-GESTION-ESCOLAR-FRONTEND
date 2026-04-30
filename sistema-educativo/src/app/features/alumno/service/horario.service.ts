import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
    constructor(http: HttpClient) { }

    private API_HORARIO = 'http://localhost:8080/api/horario';

    //obtener el horario por el codigo del alumno
    getHorarioByCodigo(codigo: string) {
        return this.API_HORARIO + '/' + codigo;
    }
}