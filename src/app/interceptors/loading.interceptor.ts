import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading-service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loading = inject(LoadingService);

  //Duracion en milisegundos
  private MIN_DURATION = 300;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const start = Date.now();
    this.loading.show();

    return next.handle(req).pipe(
      finalize(() => {
        const elapsed = Date.now() - start;
        const remaining = this.MIN_DURATION - elapsed;

        if (remaining > 0) {
          setTimeout(() => this.loading.hide(), remaining);
        } else {
          this.loading.hide();
        }
      })
    );
  }
}
