import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginador',
  imports: [],
  templateUrl: './paginador.html',
  styleUrl: './paginador.css',
})
export class Paginador {

  currentPage = input.required<number>();   
  totalPages = input.required<number>();
  
  pageChange = output<number>();

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;   //  Delta es la cantidad de páginas que muestro alrededor de la página actual
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    //  Calculo las páginas a mostrar
    for (let i = 0; i < total; i++) {
        if (i === 0 || i === total - 1 || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        }
    }

    //  Agrego puntos suspensivos (si es necesario)
    for (const i of range) {
        if (l !== undefined) {
            if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }
    return rangeWithDots;
  });

  changePage(page: number | string): void {
    if (page === '...') return;
    
    const pageNumber = Number(page);
    
    if (pageNumber !== this.currentPage() && pageNumber >= 0 && pageNumber < this.totalPages()) {
      this.pageChange.emit(pageNumber);
    }
  }
}
