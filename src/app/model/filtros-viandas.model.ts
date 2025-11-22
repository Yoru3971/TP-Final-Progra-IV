export interface FiltrosViandas{
    nombreVianda: string;
    categoria: string | null;
    esVegano: boolean;
    esVegetariano: boolean;
    esSinTacc: boolean;
    precioMin: number | null;
    precioMax: number | null;
    estaDisponible?: boolean | null;
}