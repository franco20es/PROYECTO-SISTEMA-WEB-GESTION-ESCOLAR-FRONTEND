import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NotaService {
    constructor(private http: HttpClient) { }

    private API_NOTA = 'http://localhost:8080/api/nota';

    //obtener las notas de alumno en cada curso matriculado 
    getNotaByCodigo(codigo: string) {
        return this.API_NOTA + '/' + codigo;
    }
}