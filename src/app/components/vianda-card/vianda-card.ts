import { Component, Input } from '@angular/core';
import { ViandaResponse } from '../../model/vianda-response.model';

@Component({
  selector: 'app-vianda-card',
  imports: [],
  templateUrl: './vianda-card.html',
  styleUrl: './vianda-card.css',
})
export class ViandaCard {
  @Input() vianda!: ViandaResponse;
}
