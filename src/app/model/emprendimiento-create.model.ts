export interface EmprendimientoCreate {
  nombreEmprendimiento: string;
  image: File | null;
  //se coloca null pq primero es null y luego se carga un File
  ciudad: string;
  direccion?: string;
  //en el back solo tiene @Size, no tiene ni @notNull o @notBlank
  telefono: string;
}
