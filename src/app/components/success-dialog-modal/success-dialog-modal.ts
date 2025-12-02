import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErrorDialogData } from '../../model/errorMessage.model';

@Component({
  selector: 'app-success-dialog-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './success-dialog-modal.html',
  styleUrl: './success-dialog-modal.css',
})
export class SuccessDialogModal {
  data: ErrorDialogData = inject(MAT_DIALOG_DATA);
}
