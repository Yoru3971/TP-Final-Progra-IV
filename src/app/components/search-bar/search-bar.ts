import { Component, inject, signal } from '@angular/core';
import { SearchService } from '../../services/search-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-search-bar',
  imports: [RouterLink],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  private searchService = inject(SearchService);

  public resultados = this.searchService.resultados;
  public buscadorSeleccionado = signal<boolean>(false);
  public sobreBuscador = signal<boolean>(false);
  public sobreBotonVaciar = signal<boolean>(false);
  public hayTextoEnBuscador = signal<boolean>(false);

  public onInput(event: any) {
    const value: string = event.target.value;

    this.hayTextoEnBuscador.set(value !== "");

    this.searchService.buscar(value);
  }

  public onBlur() {
    setTimeout(() => {
      this.buscadorSeleccionado.set(false);
    }, 0);
  }

  public mostrarResultados() {
    return this.buscadorSeleccionado() && this.hayTextoEnBuscador();
  }

  public vaciarBuscador(elemento: HTMLInputElement) {
    elemento.value = "";
    this.hayTextoEnBuscador.set(false);
  }
}
