import { Component } from '@angular/core';
import { FormEmprendimiento } from "../../components/form-emprendimiento/form-emprendimiento";
import { FormVianda } from '../../components/form-vianda/form-vianda';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';

@Component({
  selector: 'app-crear-emprendimiento-page-dueno',
  imports: [FormEmprendimiento,FormVianda],
  templateUrl: './crear-emprendimiento-page-dueno.html',
  styleUrl: './crear-emprendimiento-page-dueno.css',
})
export class CrearEmprendimientoPageDueno {
  //REVISAR borrar el emprendimiento response
  emprendimiento: EmprendimientoResponse = {
    id: 1,
    nombreEmprendimiento: "kevito pizzas",
    imgUrl: "https://example.com/vianda.jpg",
    ciudad: "Mar del Plata",
    direccion: "Diag EEUU",
    telefono: "2236888888",
    dueno: {
      id: 3,
      nombreCompleto: "kevin",
      email: "kevin@mail.com",
      rolUsuario: "DUENO",
      telefono: "171754688485619"
    }
  };
}
