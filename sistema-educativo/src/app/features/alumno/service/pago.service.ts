import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PagoService {
    constructor(private http: HttpClient) { }

    private API_PAGO = 'http://localhost:8080/api/pago';

    //obtener los pagos del alumno 
    getPagoByCodigo(codigo: string) {
        return this.API_PAGO + '/' + codigo;
    }

    //obetener el detalle de pago del alumno
    getDetallePagoByCodigo(codigo: string) {
        return this.API_PAGO + '/detalle/' + codigo;
    }

    //obtener el estado de pago del alumno
    getEstadoPagoByCodigo(codigo: string) {
        return this.API_PAGO + '/estado/' + codigo;
    }

    //obtener el historial de pagos del alumno
    getHistorialPagoByCodigo(codigo: string) {
        return this.API_PAGO + '/historial/' + codigo;
    }

    //obtener los pagos pendientes del alumno
    getPagosPendientesByCodigo(codigo: string) {
        return this.API_PAGO + '/pendientes/' + codigo;
    }
}