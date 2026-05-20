import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Column } from '../../models/column.model';
import { Priority, Task } from '../../models/task.model';
import { BoardService } from '../../services/board.service';
import { AutofocusDirective } from '../../directives/autofocus.directive';

@Component({
  selector: 'app-task-card',
  imports: [FormsModule, AutofocusDirective],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly column = input.required<Column>();
  readonly prevColumnId = input<string | null>(null);
  readonly nextColumnId = input<string | null>(null);

  private readonly boardService = inject(BoardService);

  isEditing = signal(false);
  editTitle = '';
  editDescription = '';
  editPriority: Priority = 'medium';

  get priorityLabel(): string {
    const labels: Record<Priority, string> = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    };
    return labels[this.task().priority];
  }

  startEdit(): void {
    const t = this.task();
    this.editTitle = t.title;
    this.editDescription = t.description;
    this.editPriority = t.priority;
    this.isEditing.set(true);
  }

  saveEdit(): void {
    if (!this.editTitle.trim()) return;
    this.boardService.updateTask(this.column().id, this.task().id, {
      title: this.editTitle.trim(),
      description: this.editDescription.trim(),
      priority: this.editPriority,
    });
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  delete(): void {
    this.boardService.deleteTask(this.column().id, this.task().id);
  }

  moveLeft(): void {
    const prev = this.prevColumnId();
    if (prev) this.boardService.moveTask(this.task().id, this.column().id, prev);
  }

  moveRight(): void {
    const next = this.nextColumnId();
    if (next) this.boardService.moveTask(this.task().id, this.column().id, next);
  }
}
