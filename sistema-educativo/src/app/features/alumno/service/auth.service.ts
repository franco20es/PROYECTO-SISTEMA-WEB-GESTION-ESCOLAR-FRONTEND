import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Alumno } from "../models/alumno.model";

@Injectable({
    providedIn: 'root'
})
export class AlumnoAutenticacionService {
    constructor(private http: HttpClient) { }

    private API_ALUMNO = 'http://localhost:8080/api/alumno';
    login(username: string, password: string) {
        return this.http.post('/api/login', {
            username,
            password
        });
    }
}