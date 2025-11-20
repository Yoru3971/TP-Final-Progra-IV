import { Component, inject, Input} from '@angular/core';
import { EmprendimientoResponse } from '../../model/emprendimiento-response.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViandaService } from '../../services/vianda-service';
import { AuthService } from '../../services/auth-service';
import { ErrorDialogModal } from '../../shared/components/error-dialog-modal/error-dialog-modal';
import { CATEGORIAS_VIANDA } from '../../constants/categorias-viandas';

@Component({
  selector: 'app-form-vianda',
  imports: [ReactiveFormsModule],
  templateUrl: './form-vianda.html',
  styleUrl: './form-vianda.css',
})
export class FormVianda {
  //Le paso del padre el emprendimiento entero
  @Input() emprendimiento!:EmprendimientoResponse;
  
  private fb = inject(FormBuilder);
  private router =inject(Router);
  private viandaService = inject(ViandaService);

  public categorias = CATEGORIAS_VIANDA;

//maximos tamaño de la imagen
  maxWidth = 1920;
  maxHeight = 1080;

  formVianda = this.fb.group({
    nombreVianda: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    categoria: [null, Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(400)]],
    image: [null, Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    esVegano: [false, Validators.required],
    esVegetariano: [false, Validators.required],
    esSinTacc: [false, Validators.required],
  });
  dialog: any;

  //valido la imagen y una resolucion maxima
  onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            if (img.width <= this.maxWidth && img.height <= this.maxHeight) {
              this.formVianda.patchValue({ image: file });
            } else {
              this.formVianda.patchValue({ image: null });
              this.dialog.open(ErrorDialogModal, {
                data: { message: `La imagen no debe superar ${this.maxWidth}x${this.maxHeight}px` },
                panelClass: 'modal-error',
              });
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
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
          data: { message: backendMsg }
        });
      }
    });
  }
}
