import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '../../models/column.model';
import { Priority } from '../../models/task.model';
import { BoardService } from '../../services/board.service';
import { TaskCardComponent } from '../task-card/task-card';
import { AutofocusDirective } from '../../directives/autofocus.directive';

@Component({
  selector: 'app-column',
  imports: [FormsModule, TaskCardComponent, AutofocusDirective],
  templateUrl: './column.html',
  styleUrl: './column.scss',
})
export class ColumnComponent {
  readonly column = input.required<Column>();
  readonly prevColumnId = input<string | null>(null);
  readonly nextColumnId = input<string | null>(null);

  private readonly boardService = inject(BoardService);

  showAddForm = signal(false);
  newTitle = '';
  newDescription = '';
  newPriority: Priority = 'medium';

  addTask(): void {
    if (!this.newTitle.trim()) return;
    this.boardService.addTask(
      this.column().id,
      this.newTitle,
      this.newDescription,
      this.newPriority
    );
    this.resetForm();
  }

  cancelAdd(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.newTitle = '';
    this.newDescription = '';
    this.newPriority = 'medium';
    this.showAddForm.set(false);
  }
}
