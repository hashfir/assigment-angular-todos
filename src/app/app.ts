import { Component } from '@angular/core';
import { BoardComponent } from './components/board/board';

@Component({
  selector: 'app-root',
  imports: [BoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
