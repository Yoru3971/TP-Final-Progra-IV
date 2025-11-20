import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';
import { EmprendimientoService } from '../../services/emprendimiento-service';
import { ViandaService } from '../../services/vianda-service';
import { ViandaResponse } from '../../model/vianda-response.model';
import { EmprendimientoInfo } from '../../components/emprendimiento-info/emprendimiento-info';
import { ViandaCardDetallada } from '../../components/vianda-card-detallada/vianda-card-detallada';
import { EmprendimientoFiltrosViandas } from '../../components/emprendimiento-filtros-viandas/emprendimiento-filtros-viandas';
import { FiltrosViandas } from '../../model/filtros-viandas.model';

@Component({
  selector: 'app-emprendimiento-page',
  imports: [
    EmprendimientoInfo,
    EmprendimientoFiltrosViandas,
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
  viandas: ViandaResponse[] = [];             //  Estas son las viandas que se muestran en pantalla
  viandasTotales: ViandaResponse[] = [];      //  Estas son todas las viandas del emprendimiento (sin filtrar)
  filtrosActuales: FiltrosViandas | null = null;

  esDueno: boolean = false;   // cambia el comportamiento de los componentes (según si es dueño o cliente)


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

        // Verifico si es dueño o cliente
        if (rolUsuario === 'DUENO') {
          if (this.emprendimiento.dueno.id === usuarioIdLogueado){
            this.esDueno = true;
          }else{
            // AGREGAR page error (no le pertenece el emprendimiento)
          }
          
        } else {
          this.esDueno = false;
        }
        
        this.cargarViandasFiltradas();  // Levanto las viandas (la primera vez sin filtros)
      },
      error: (err) => {     // AGREGAR page error (el emprendimiento no existe)
        console.error('Error cargando emprendimiento', err);
      }
    });

  }

  //  -------------------  Componente: emprendimiento-info -------------------
  abrirModalEditarEmprendimiento() {
    console.log('Abre modal de edición');   //  AGREGAR abrir modal de edición del emprendimiento
  }

  abrirModalCarrito() {
    console.log('Abre carrito');    //  AGREGAR abrir modal carrito
  }

  //  -------------------  Componente: emprendimiento-filtros-viandas -------------------
  onFiltrosChanged(filtro: FiltrosViandas) {
    this.filtrosActuales = filtro;
    this.cargarViandasFiltradas();
  }

  cargarViandasFiltradas() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const filtrosParaEnviar = this.filtrosActuales || {} as FiltrosViandas; 
    let llamadaApi;

    if (this.esDueno) {
        // CASO 1: DUEÑO (Trae todas sus viandas)
        llamadaApi = this.viandaService.getViandasDueno(id, filtrosParaEnviar);
    } else {
        // CASO 2: CLIENTE (Trae solo viandas disponibles)
        llamadaApi = this.viandaService.getViandasCliente(id, filtrosParaEnviar);
    }
    
    llamadaApi.subscribe({
        next: (data) => {
            this.viandas = data;
            
            if (!this.filtrosActuales || Object.values(this.filtrosActuales).every(v => v === null || v === '' || v === false)) {
            this.viandasTotales = data; 
        }
        },
        error: (err) => {
            const backendMsg =
            err.error?.message || err.error?.error || 'Error desconocido al filtrar viandas';

          console.error(backendMsg);
        }
    });
}
  
}
