import { Component, inject, Input } from '@angular/core';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViandaService } from '../../services/vianda-service';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoriaVianda } from '../../shared/enums/categoriaVianda.enum';

@Component({
  selector: 'app-form-vianda',
  imports: [ReactiveFormsModule],
  templateUrl: './form-vianda.html',
  styleUrl: './form-vianda.css',
})
export class FormVianda {
  //Le paso del padre el emprendimiento entero
  @Input() emprendimiento!: EmprendimientoResponse;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private viandaService = inject(ViandaService);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef);

  public categorias = Object.entries(CategoriaVianda).map(([key, label]) => ({
    key,
    label,
  }));

  selectedFileName: string | null = null;
  public imagePreviewUrl: string | ArrayBuffer | null = null; //Propiedad para la previsualización

  // Referencia al input de tipo file para poder resetearlo
  // Esto es necesario para permitir la selección del mismo archivo de nuevo después de eliminarlo
  fileInputRef: any;

  //maximos tamaño de la imagen
  maxWidth = 1920;
  maxHeight = 1080;

  formVianda = this.fb.group({
    nombreVianda: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    categoria: [null, Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(400)]],
    image: [null, Validators.required],
    precio: ['', [Validators.required, Validators.min(0)]],
    esVegano: [false, Validators.required],
    esVegetariano: [false, Validators.required],
    esSinTacc: [false, Validators.required],
  });

  // Guardamos la referencia al input de archivo
  onFileInputReady(element: HTMLInputElement) {
    this.fileInputRef = element;
  }

  //valido la imagen y una resolucion maxima
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.selectedFileName = null;
      this.imagePreviewUrl = null; // LIMPIAR PREVIEW
      this.formVianda.get('image')?.setValue(null);
      this.formVianda.get('image')?.markAsTouched();
      return;
    }

    this.selectedFileName = file.name;

    //Leo el archivo para obtener la previsualización
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result; //Establecer URL de preview inmediatamente

      //Validación de dimensiones
      const img = new Image();
      img.onload = () => {
        if (img.width <= this.maxWidth && img.height <= this.maxHeight) {
          this.formVianda.patchValue({ image: file });
          this.formVianda.get('image')?.markAsPristine();
          this.formVianda.get('image')?.markAsUntouched();
        } else {
          //Error de dimensiones
          this.formVianda.patchValue({ image: null });
          this.imagePreviewUrl = null; //Limpiar preview si hay error
          this.selectedFileName = null; //Limpiar nombre si hay error
          this.dialog.open(ErrorDialogModal, {
            data: { message: `La imagen no debe superar ${this.maxWidth}x${this.maxHeight}px` },
            panelClass: 'modal-error',
          });
        }
        // Marcar como tocado para disparar la validación de Angular
        this.formVianda.get('image')?.markAsTouched();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  //Metodo para eliminar la imagen seleccionada
  removeImage() {
    this.selectedFileName = null;
    this.imagePreviewUrl = null;
    this.formVianda.get('image')?.setValue(null);
    this.formVianda.get('image')?.markAsDirty(); // Marca como dirty para que el required se muestre

    if (this.fileInputRef) {
      this.fileInputRef.value = '';
    }
  }

  onSubmit() {
    if (this.formVianda.invalid) return;

    if (!this.emprendimiento?.id) {
      this.dialog.open(ErrorDialogModal, {
        data: { message: 'Error: no se recibió el emprendimiento.' },
      });
      return;
    }

    const formData = new FormData();
    const formValues = this.formVianda.value;

    formData.append('nombreVianda', formValues.nombreVianda!);
    formData.append('categoria', String(formValues.categoria!));
    formData.append('descripcion', formValues.descripcion!);
    formData.append('image', formValues.image!);
    formData.append('precio', String(formValues.precio!));
    formData.append('esVegano', String(formValues.esVegano!));
    formData.append('esVegetariano', String(formValues.esVegetariano!));
    formData.append('esSinTacc', String(formValues.esSinTacc!));
    formData.append('emprendimientoId', String(this.emprendimiento.id));

    //REVISAR acomodar la ruta y agregar snackbar
    this.viandaService.createVianda(formData).subscribe({
      next: () => this.router.navigate(['/mis-viandas']), // ajustá ruta
      error: (err) => {
        const backendMsg = err.error?.message || 'Error desconocido al crear la vianda';
        this.dialog.open(ErrorDialogModal, {
          data: { message: backendMsg },
        });
      },
    });
  }

  cerrarModal(){
    this.dialogRef.close();
  }
}
