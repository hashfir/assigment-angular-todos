import { Component, inject } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { ColumnComponent } from '../column/column';

@Component({
  selector: 'app-board',
  imports: [ColumnComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class BoardComponent {
  readonly boardService = inject(BoardService);
  readonly columns = this.boardService.columns;
}
