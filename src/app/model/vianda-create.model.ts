export interface ViandaCreate {
  nombreVianda: string;
  categoria: string;
  descripcion: string;
  image: File | null;
  precio: number;
  esVegano: boolean;
  esVegetariano: boolean;
  esSinTacc: boolean;
  emprendimientoId: number;
}
