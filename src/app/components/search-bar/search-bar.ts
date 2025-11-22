import { Component, inject } from '@angular/core';
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
  public buscadorSeleccionado = false;
  public hayTextoEnBuscador = false;

  public onInput(event: any) {
    const value: string = event.target.value;

    this.hayTextoEnBuscador = value !== "";

    this.searchService.buscar(value);
  }

  public onBlur() {
    setTimeout(() => {
      this.buscadorSeleccionado = false;
    }, 0);
  }
}
