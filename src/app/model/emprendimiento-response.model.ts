import { UsuarioResponse } from './usuario-response.model';
import { ViandaResponse } from './vianda-response.model';

export interface EmprendimientoResponse {
  id: number;
  nombreEmprendimiento: string;
  imagenUrl: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  estaDisponible: boolean;
  dueno: UsuarioResponse;
  viandas: ViandaResponse[];
  _links?: any;
}
