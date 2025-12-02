import { Component, EventEmitter, Output, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'; // Opcional para iconos

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './date-range-picker.html',
  styleUrls: ['./date-range-picker.css'],
})
export class DateRangePickerComponent {
  // Estados
  readonly isRangeMode = signal(false);
  readonly startDate = signal<Date | null>(null);
  readonly endDate = signal<Date | null>(null);

  @Output() fechasSeleccionadas = new EventEmitter<{ desde: Date; hasta: Date }>();

  // Label dinámico para feedback visual
  readonly displayLabel = computed(() => {
    const start = this.startDate();
    const end = this.endDate();

    if (!start) return 'Seleccionar fecha';

    const startStr = start.toLocaleDateString('es-AR');

    if (!this.isRangeMode()) return startStr;

    const endStr = end ? end.toLocaleDateString('es-AR') : '...';
    return `${startStr} — ${endStr}`;
  });

  toggleMode() {
    this.isRangeMode.update((v) => !v);

    // Lógica de transición inteligente
    const currentStart = this.startDate();

    if (this.isRangeMode()) {
      // Al pasar a Rango: Mantenemos la fecha actual como INICIO, borramos el FIN
      // para obligar al usuario a elegir el final.
      this.endDate.set(null);
    } else {
      // Al pasar a Único: Si había rango, nos quedamos solo con el inicio.
      this.endDate.set(currentStart);
      this.emitirSiCompleto(); // Re-emitir como día único
    }
  }

  // Se ejecuta cuando el usuario elige una fecha en modo "Un solo día"
  onSingleDateChange(event: any) {
    const date = event.value;
    this.startDate.set(date);
    this.endDate.set(date); // En modo simple, inicio y fin son iguales
    this.emitirSiCompleto();
  }

  // Se ejecuta cuando cambia el inicio en modo "Rango"
  onRangeStartChange(event: any) {
    this.startDate.set(event.value);
    // No emitimos todavía, esperamos al end
  }

  // Se ejecuta cuando cambia el fin en modo "Rango"
  onRangeEndChange(event: any) {
    this.endDate.set(event.value);
    this.emitirSiCompleto();
  }

  private emitirSiCompleto() {
    const d1 = this.startDate();
    const d2 = this.endDate();

    if (d1 && d2) {
      this.fechasSeleccionadas.emit({ desde: d1, hasta: d2 });
    }
  }
}
