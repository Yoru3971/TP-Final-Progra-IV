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
  searchService = inject(SearchService);

  resultados = this.searchService.resultados;

  onInput(event: any) {
    this.searchService.buscar(event.target.value);
  }
}
