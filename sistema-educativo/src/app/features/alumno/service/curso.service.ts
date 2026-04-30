import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CursoService {
    constructor(private http: HttpClient) { }

    private API_CURSO = 'http://localhost:8080/api/curso';

    //obtener  cursos por el codigo del alumno
    getCursoByCodigo(codigo: string) {
        return this.API_CURSO + '/' + codigo;
    }

    //
}