import { UsuarioResponse } from "./usuario-response.model";

export interface EmprendimientoResponse {
    id: number;
    nombreEmprendimiento: string;
    imgUrl: string;
    ciudad: string;
    direccion: string;
    telefono: string;
    dueno: UsuarioResponse;
}