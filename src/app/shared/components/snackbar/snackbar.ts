import { Component, Inject } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarData } from '../../../model/snackbar-data.model';

@Component({
  selector: 'app-snackbar',
  imports: [
    MatIcon
  ],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.css',
})
export class Snackbar {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    public snackBarRef: MatSnackBarRef<Snackbar>
  ) {}

}
