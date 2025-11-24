import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViandaService } from '../../services/vianda-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViandaResponse } from '../../model/vianda-response.model';
import { CategoriaVianda } from '../../shared/enums/categoriaVianda.enum';
import { ViandaUpdate } from '../../model/vianda-update.model';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { firstValueFrom } from 'rxjs';
import { ConfirmarModalService } from '../../services/confirmar-modal-service';
import { SnackbarData } from '../../model/snackbar-data.model';
import { Snackbar } from '../../shared/components/snackbar/snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-vianda-update',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-vianda-update.html',
  styleUrl: './form-vianda-update.css',
})
export class FormViandaUpdate implements OnInit {
  private fb = inject(FormBuilder);
  private viandaService = inject(ViandaService);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private confirmarModalService = inject(ConfirmarModalService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { vianda: ViandaResponse }) {}

  public categorias = Object.entries(CategoriaVianda).map(([key, label]) => ({
    key,
    label,
  }));

  private categoriaMap: Map<string, string> = new Map(
    Object.entries(CategoriaVianda).map(([key, label]) => [label, key])
  );

  loading = false;

  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  newImagePreviewUrl: string | ArrayBuffer | null = null;
  currentImageUrl: string | null = null;

  fileInputRef: any;
  maxWidth = 1920;
  maxHeight = 1080;

  formVianda = this.fb.group({
    nombreVianda: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    categoria: [null as string | null, Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(400)]],
    precio: [0, [Validators.required, Validators.min(0)]],
    esVegano: [false, Validators.required],
    esVegetariano: [false, Validators.required],
    esSinTacc: [false, Validators.required],
    estaDisponible: [true, Validators.required],
    image: [null],
  });

  ngOnInit(): void {
    if (this.data && this.data.vianda) {
      this.cargarDatos(this.data.vianda);
      this.cdr.detectChanges();
    }
  }

  cargarDatos(vianda: ViandaResponse) {
    this.formVianda.patchValue({
      nombreVianda: vianda.nombreVianda,
      categoria: String(vianda.categoria),
      descripcion: vianda.descripcion,
      precio: vianda.precio,
      esVegano: vianda.esVegano,
      esVegetariano: vianda.esVegetariano,
      esSinTacc: vianda.esSinTacc,
      estaDisponible: vianda.estaDisponible,
    });

    this.currentImageUrl = vianda.imagenUrl || null;
  }

  onFileInputReady(element: HTMLInputElement) {
    this.fileInputRef = element;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.resetImageSelection();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const tempUrl = e.target.result;

      const img = new Image();
      img.onload = () => {
        if (img.width <= this.maxWidth && img.height <= this.maxHeight) {
          this.selectedFile = file;
          this.selectedFileName = file.name;
          this.newImagePreviewUrl = tempUrl;
          this.formVianda.patchValue({ image: null });
          this.formVianda.get('image')?.markAsTouched();
        } else {
          this.resetImageSelection();
          this.dialog.open(ErrorDialogModal, {
            data: { message: `La imagen no debe superar ${this.maxWidth}x${this.maxHeight}px` },
            panelClass: 'modal-error',
          });
        }
        this.cdr.detectChanges();
      };
      img.src = tempUrl;
    };
    reader.readAsDataURL(file);
  }

  resetImageSelection() {
    this.selectedFile = null;
    this.selectedFileName = null;
    this.newImagePreviewUrl = null;
    this.formVianda.get('image')?.setValue(null);
    if (this.fileInputRef) this.fileInputRef.value = '';
    this.cdr.detectChanges();
  }

  removeNewImage() {
    this.resetImageSelection();
  }

  async onDelete() {
    const confirmado = await firstValueFrom(
      this.confirmarModalService.confirmar({
        titulo: 'Eliminar Vianda',
        texto:
          '¿Seguro de que querés eliminar la vianda? <span>Esta acción es irreversible.</span>',
        textoEsHtml: true,
        critico: true,
      })
    );

    if (!confirmado) return;

    this.viandaService.deleteVianda(this.data.vianda.id).subscribe({
      next: () => {
        this.deleteSuccess();
      },
      error: () => {
        this.handleDeleteError(null);
      },
    });
  }

  handleDeleteError(error: any) {
    const backendMsg =
      error?.message || 'Error al eliminar la vianda. Es posible que tenga pedidos asociados.';

    this.dialog.open(ErrorDialogModal, {
      data: { message: backendMsg },
      panelClass: 'modal-error',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  private deleteSuccess() {
    const data: SnackbarData = {
      message: 'Vianda eliminada con éxito.',
      iconName: 'check_circle',
    };

    this.snackBar.openFromComponent(Snackbar, {
      data,
      duration: 3000,
      panelClass: 'snackbar-panel',
      verticalPosition: 'bottom',
    });

    this.dialogRef.close(true);
  }

  onSubmit() {
    if (this.formVianda.invalid) return;

    this.loading = true;
    const formValues = this.formVianda.value;
    const viandaId = this.data.vianda.id;

    const updateDTO: ViandaUpdate = {
      nombreVianda: formValues.nombreVianda!,
      categoria: formValues.categoria as any,
      descripcion: formValues.descripcion!,
      precio: Number(formValues.precio),
      esVegano: !!formValues.esVegano,
      esVegetariano: !!formValues.esVegetariano,
      esSinTacc: !!formValues.esSinTacc,
      estaDisponible: !!formValues.estaDisponible,
    };

    this.viandaService.updateVianda(viandaId, updateDTO).subscribe({
      next: () => {
        if (this.selectedFile) {
          this.uploadImage(viandaId);
        } else {
          this.loading = false;
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err);
      },
    });
  }

  uploadImage(id: number) {
    this.viandaService.updateImagenVianda(id, this.selectedFile!).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.dialog.open(ErrorDialogModal, {
          data: { message: 'Datos actualizados, pero error al subir la imagen.' },
        });
      },
    });
  }

  handleError(err: any) {
    const backendMsg = err.error?.message || 'Error desconocido al actualizar';
    this.dialog.open(ErrorDialogModal, {
      data: { message: backendMsg },
    });
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}
