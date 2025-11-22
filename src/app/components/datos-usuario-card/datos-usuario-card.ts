import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { UsuarioResponse } from '../../model/usuario-response.model';
import { MatDialog } from '@angular/material/dialog';
import { FormUserUpdate } from '../form-user-update/form-user-update';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-datos-usuario-card',
  imports: [],
  templateUrl: './datos-usuario-card.html',
  styleUrl: './datos-usuario-card.css',
})
export class DatosUsuarioCard implements OnInit{
  private usuarioService = inject(UsuarioService);

  @Input() usuario!: UsuarioResponse;

  public usuarioSignal = signal<UsuarioResponse>(this.usuario);

  ngOnInit(): void {
    if (this.usuario) {
      this.usuarioSignal.set(this.usuario);
      console.log(this.usuarioSignal()); //REVISAR quitar este log, solo de test
    }
  }

  private dialog = inject(MatDialog);

  openUpdateModal() {
    const dialogRef = this.dialog.open(FormUserUpdate, {
          data: this.usuario,
          panelClass: 'modal-vianda',
          autoFocus: false,
          restoreFocus: false,
        });
    dialogRef.afterClosed().subscribe(result => {
      this.usuarioService.getPerfilUsuario().subscribe({
      next: (data) => {
        this.usuarioSignal.set(data);
      },
      error: (err) => console.error(err),
    });
    })
  }
  
}
