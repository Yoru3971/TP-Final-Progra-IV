import { ViandaCantidadRequest } from './vianda-cantidad-request.model';

export interface PedidoRequest {
  fechaEntrega: string;
  clienteId: number;
  emprendimientoId: number;
  viandas: ViandaCantidadRequest[];
}
