export interface PedidoUpdateRequest {
  estado: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'CANCELADO';
  fechaEntrega: string; // yyyy-MM-dd
}
