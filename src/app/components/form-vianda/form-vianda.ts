import { Component, inject, Input } from '@angular/core';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViandaService } from '../../services/vianda-service';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoriaVianda } from '../../shared/enums/categoriaVianda.enum';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-form-vianda',
  imports: [ReactiveFormsModule],
  templateUrl: './form-vianda.html',
  styleUrl: './form-vianda.css',
})
export class FormVianda {
  @Input() emprendimiento!: EmprendimientoResponse;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private viandaService = inject(ViandaService);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef);
  private cdr = inject(ChangeDetectorRef); //agregado para forzar render

  public categorias = Object.entries(CategoriaVianda).map(([key, label]) => ({
    key,
    label,
  }));

  selectedFileName: string | null = null;
  public imagePreviewUrl: string | ArrayBuffer | null = null;

  fileInputRef: any;

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

  onFileInputReady(element: HTMLInputElement) {
    this.fileInputRef = element;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.selectedFileName = null;
      this.imagePreviewUrl = null;
      this.formVianda.get('image')?.setValue(null);
      this.formVianda.get('image')?.markAsTouched();
      this.cdr.detectChanges(); //asegura que se vea el cambio
      return;
    }

    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;

      //evita que necesites "clic afuera"
      this.cdr.detectChanges();

      const img = new Image();
      img.onload = () => {
        if (img.width <= this.maxWidth && img.height <= this.maxHeight) {
          this.formVianda.patchValue({ image: file });
          this.formVianda.get('image')?.markAsPristine();
          this.formVianda.get('image')?.markAsUntouched();
        } else {
          this.formVianda.patchValue({ image: null });
          this.imagePreviewUrl = null;
          this.selectedFileName = null;

          this.dialog.open(ErrorDialogModal, {
            data: { message: `La imagen no debe superar ${this.maxWidth}x${this.maxHeight}px` },
            panelClass: 'modal-error',
          });
        }

        this.formVianda.get('image')?.markAsTouched();
        this.cdr.detectChanges(); //actualización final
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedFileName = null;
    this.imagePreviewUrl = null;
    this.formVianda.get('image')?.setValue(null);
    this.formVianda.get('image')?.markAsDirty();

    if (this.fileInputRef) {
      this.fileInputRef.value = '';
    }

    this.cdr.detectChanges(); //asegura desaparición inmediata
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

    this.viandaService.createVianda(formData).subscribe({
      next: () => this.router.navigate(['/mis-viandas']),
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

