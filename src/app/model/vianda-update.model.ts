import { CategoriaVianda } from "../shared/enums/categoriaVianda.enum";

export interface ViandaUpdate {
    nombreVianda: string;
    categoria: CategoriaVianda;
    descripcion: string;
    precio: number;
    esVegano: boolean;
    esVegetariano: boolean;
    esSinTacc: boolean;
    estaDisponible: boolean;
}