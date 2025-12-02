import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Spinner } from './components/utils/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('TP-Final');
}
