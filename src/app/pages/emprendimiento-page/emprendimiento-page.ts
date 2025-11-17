import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { ViandaService } from '../../services/vianda-service';
import { ViandaResponse } from '../../model/vianda-response.model';
import { EmprendimientoInfo } from '../../components/emprendimiento-info/emprendimiento-info';
import { FiltrosVianda } from '../../components/filtros-vianda/filtros-vianda';
import { ViandaCardDetallada } from '../../components/vianda-card-detallada/vianda-card-detallada';

@Component({
  selector: 'app-emprendimiento-page',
  imports: [
    EmprendimientoInfo,
    FiltrosVianda,
    ViandaCardDetallada
  ],
  templateUrl: './emprendimiento-page.html',
  styleUrl: './emprendimiento-page.css',
})
export class EmprendimientoPage implements OnInit {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private emprendimientoService = inject(EmprendimientoService);
  private viandaService = inject(ViandaService);

  emprendimiento: EmprendimientoResponse | null = null;
  viandas: ViandaResponse[] = [];

  esDueno: boolean = false;   // lo uso para manejar distintos modos en los componentes (según si es dueño o cliente)


  ngOnInit(): void {
    const idEmprendimiento = this.route.snapshot.paramMap.get('id');
    
    if (idEmprendimiento) {
      this.cargarDatos(+idEmprendimiento);
    }
  }

  cargarDatos(id: number) {

    // Levanto la información del Emprendimiento
    this.emprendimientoService.getEmprendimientoById(id).subscribe({
      next: (data) => {
        this.emprendimiento = data;

        const usuarioIdLogueado = this.authService.usuarioId();
        const rolUsuario = this.authService.currentUserRole();

        // Verifico que sea dueño y que el emprendimiento pertenezca a ese dueño
        if (rolUsuario === 'DUENO' && this.emprendimiento.dueno.id === usuarioIdLogueado) {
          this.esDueno = true;
        } else {
          this.esDueno = false;
        }     //  AGREGAR debería separar las condiciones (si no es dueño, es cliente 
              //  pero si es dueño y no le pertenece, tiro error o que hago?)
      },
      error: (err) => {     // AGREGAR manejar error (emprendimiento no existe)
        console.error('Error cargando emprendimiento', err);
      }
    });

    // Levanto la información de las viandas
    this.viandaService.getViandasByEmprendimientoId(id).subscribe({
      next: (viandasData) => {
        this.viandas = viandasData;
      },
      error: (err) => {     // AGREGAR manejar error (viandas no existen)
        console.error('Error cargando viandas', err)
      }
    });
  }
  
}
