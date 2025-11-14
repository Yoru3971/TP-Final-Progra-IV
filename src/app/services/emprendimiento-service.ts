import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmprendimientoResponse } from '../model/emprendimiento-response.model';

@Injectable({
  providedIn: 'root',
})
export class EmprendimientoService {
  private apiUrl = 'http://localhost:8080/api/public/emprendimientos';

  constructor(private http: HttpClient) {}

  //REVISAR Por ahora va asi, mas adelante evaluar si hace falta usar signals para cuando hagamos POST/PUT/DELETE
  getEmprendimientos() {
    return this.http.get<EmprendimientoResponse[]>(this.apiUrl);
  }
}
