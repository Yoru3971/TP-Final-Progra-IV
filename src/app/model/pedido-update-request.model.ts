import { EstadoPedido } from "../shared/enums/estadoPedido.enum";

export interface PedidoUpdateRequest {
  estado?: EstadoPedido | null;
  fechaEntrega?: string | null;
}

