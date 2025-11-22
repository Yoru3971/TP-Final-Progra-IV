import { DetalleViandaResponse } from './detalle-vianda-response.model';
import { EmprendimientoResponse } from './emprendimiento-response.model';
import { UsuarioResponse } from './usuario-response.model';

export interface PedidoResponse {
  id: number;
  cliente: UsuarioResponse;
  estado: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'CANCELADO';
  fechaEntrega: string;
  total: number;
  emprendimiento: EmprendimientoResponse;
  viandas: DetalleViandaResponse[];
}
