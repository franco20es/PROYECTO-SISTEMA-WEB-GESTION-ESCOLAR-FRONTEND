import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

private API_ALUMNOS= 'http://localhost:8080/api/alumnos';
  constructor(http: HttpClient) { }

  //obtener el alumno por su codigo
  getAlumnoByCodigo(codigo: string) {
    return this.API_ALUMNOS + '/' + codigo;
  }

  //obtener el alumno por su id
  getAlumnoById(id: number) {
    return this.API_ALUMNOS + '/' + id;
  }

  //actualizar el alumno
  updateAlumno(id: number, alumno: any) {
    return this.API_ALUMNOS + '/' + id;
  }

  //crear un nuevo alumno
  createAlumno(alumno: any) {
    return this.API_ALUMNOS;
  }

   }
