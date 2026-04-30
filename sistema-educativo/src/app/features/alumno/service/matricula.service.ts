import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MatriculaService {
    constructor(http: HttpClient) {
    }

    private API_MATRICULA = 'http://localhost:8080/api/matricula';

    //obtener la matricula por el codigo del alumno
    getMatriculaByCodigo(codigo: string) {
        return this.API_MATRICULA + '/' + codigo;
    }

    //registrar matricula
    registrarMatricula(matricula: any) {
        return this.API_MATRICULA;
    }

    //editar matricula maximo 3 veces
    editarMatricula(id: number, matricula: any) {
        return this.API_MATRICULA + '/' + id;
    }

    //opciones de matricula 

    /*Alumno: Jean Franco
      Año: 2026
      Grado disponible: 3ro Secundaria
    Secciones disponibles:
  - A (Mañana)
  - B (Tarde)

[Seleccionar]
[Confirmar Matrícula] */
    opcionesMatricula() {
        return this.API_MATRICULA + '/opciones';
    }



}