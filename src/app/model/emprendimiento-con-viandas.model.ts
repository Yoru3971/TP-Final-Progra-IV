import { EmprendimientoResponse } from './emprendimiento-response.model';
import { ViandaResponse } from './vianda-response.model';
export interface EmprendimientoConViandas extends EmprendimientoResponse {
  viandas: ViandaResponse[];
}
