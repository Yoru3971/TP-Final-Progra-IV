import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViandaResponse } from '../../../model/vianda-response.model';

@Component({
  selector: 'app-vianda-extended-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './vianda-extended-modal.html',
  styleUrl: './vianda-extended-modal.css',
})
export class ViandaExtendedModal {
  constructor(@Inject(MAT_DIALOG_DATA) public vianda: ViandaResponse) {}
}
