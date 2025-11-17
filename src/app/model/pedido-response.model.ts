import { DetalleViandaResponse } from './detalle-vianda-response.model';
import { UsuarioResponse } from './usuario-response.model';

export interface PedidoResponse {
  id: number;
  cliente: UsuarioResponse;
  estado: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'CANCELADO';
  fechaEntrega: string;
  total: number;
  viandas: DetalleViandaResponse[];
}
