export interface EmprendimientoCreate {
  nombreEmprendimiento: string;
  image: File | null;
  ciudad: string;
  direccion?: string;
  telefono: string;
  idUsuario: number;
}
