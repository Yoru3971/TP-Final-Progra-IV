import { UsuarioResponse } from './usuario-response.model';

export interface EmprendimientoResponse {
  id: number;
  nombreEmprendimiento: string;
  imagenUrl: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  estaDisponible: boolean;
  dueno: UsuarioResponse;
}
