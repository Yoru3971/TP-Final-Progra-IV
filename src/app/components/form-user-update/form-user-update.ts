import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioUpdate } from '../../model/usuario-update.model';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-form-user-update',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './form-user-update.html',
  styleUrls: ['./form-user-update.css'],
})
export class FormUserUpdate {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private dialogRef = inject(MatDialogRef<FormUserUpdate>);
  private data = inject(MAT_DIALOG_DATA) as UsuarioUpdate | null;

  error = signal<string | null>(null);
  exito = signal<string | null>(null);
  cargando = signal<boolean>(false);

  form = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]],
  });

  constructor() {
    if (this.data) {
      this.form.patchValue({
        nombreCompleto: this.data.nombreCompleto,
        email: this.data.email,
        telefono: this.data.telefono,
      });
    }
  }

  actualizarUsuario() {
    const id = this.data?.id;
    if (this.form.invalid || !id) return;

    this.error.set(null);
    this.exito.set(null);
    this.cargando.set(true);

    const payload: UsuarioUpdate = this.form.value as UsuarioUpdate;

    this.usuarioService.updateUsuario(id, payload).subscribe({
      next: (resp) => {
        const emailCambio = this.data?.email !== payload.email;

        this.exito.set('Datos actualizados correctamente');
        this.cargando.set(false);

        this.dialogRef.close({ resp, emailCambio });
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al actualizar usuario');
        this.cargando.set(false);
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
