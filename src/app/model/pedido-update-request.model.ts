import { EstadoPedido } from "../shared/enums/estadoPedido.enum";

export interface PedidoUpdateRequest {
  estado: EstadoPedido
  fechaEntrega: string; // yyyy-MM-dd
}
