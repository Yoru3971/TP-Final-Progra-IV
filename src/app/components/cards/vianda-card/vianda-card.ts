import { Component, Input, inject } from '@angular/core';
import { ViandaResponse } from '../../../model/vianda-response.model';
import { MatDialog } from '@angular/material/dialog';
import { ViandaExtendedModal } from '../../modals/vianda-extended-modal/vianda-extended-modal';

@Component({
  selector: 'app-vianda-card',
  imports: [],
  templateUrl: './vianda-card.html',
  styleUrl: './vianda-card.css',
})
export class ViandaCard {
  @Input() vianda!: ViandaResponse;
  private dialog = inject(MatDialog);

  openViandaModal() {
    this.dialog.open(ViandaExtendedModal, {
      width: '100rem',
      data: this.vianda,
      panelClass: 'modal-vianda',
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
