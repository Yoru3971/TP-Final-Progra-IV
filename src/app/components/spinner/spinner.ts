import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading-service';
@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {
  private loadingService = inject(LoadingService);
  loading = this.loadingService.loading;
}
