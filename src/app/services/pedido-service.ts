import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, UserRole } from './auth-service';
import { PedidoResponse } from '../model/pedido-response.model';
import { catchError, of, tap } from 'rxjs';
import { PedidoUpdateRequest } from '../model/pedido-update-request.model';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  // Lista completa de pedidos del backend
  public allPedidos = signal<PedidoResponse[]>([]);

  // Pedidos ordenados DESC por fechaEntrega (más reciente primero)
  public pedidosOrdenados = computed(() => {
    const list = this.allPedidos();
    return [...list].sort((a, b) => {
      const fa = new Date(a.fechaEntrega).getTime();
      const fb = new Date(b.fechaEntrega).getTime();
      return fb - fa;
    });
  });

  // URLs base según rol
  private baseUrls = {
    DUENO: 'http://localhost:8080/api/dueno/pedidos',
    CLIENTE: 'http://localhost:8080/api/cliente/pedidos',
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getApiUrl(): string {
    const rol: UserRole = this.authService.currentUserRole();
    return rol === 'DUENO' ? this.baseUrls.DUENO : this.baseUrls.CLIENTE;
  }

  //función para cargar todos los pedidos
  //obtiene los pedidos desde el backend y lo guarda en un signal
  fetchPedidos() {
    const url = this.getApiUrl();

    this.http
      .get<PedidoResponse[]>(url)
      .pipe(
        catchError((err) => {
          if (err.status !== 404) {
            console.error('Error al cargar pedidos:', err);
          }
          return of([]);
        })
      )
      .subscribe((result) => {
        setTimeout(() => this.allPedidos.set(result));
      });
  }

  updatePedido(id: number, pedidoUpdate: PedidoUpdateRequest) {
    const url = `${this.getApiUrl()}/id/${id}`;

    return this.http
      .put<PedidoResponse>(url, pedidoUpdate)
      .pipe(
        tap((actualizado) =>
          this.allPedidos.update((list) => list.map((p) => (p.id === id ? actualizado : p)))
        )
      );
  }
}
