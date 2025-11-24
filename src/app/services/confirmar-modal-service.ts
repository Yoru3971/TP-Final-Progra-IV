import { inject, Injectable } from '@angular/core';
import { ConfirmarModalData } from '../model/confirmar-modal-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarModal } from '../components/confirmar-modal/confirmar-modal';

@Injectable({
  providedIn: 'root',
})
export class ConfirmarModalService {
  private dialog = inject(MatDialog);

  public confirmar(data: Partial<ConfirmarModalData>) {
    return this.dialog
      .open(ConfirmarModal, {
        data: data,
        disableClose: true,
        width: '40rem',
      })
      .afterClosed();
  }
}
