import { Injectable, signal } from '@angular/core';
import { Column } from '../models/column.model';
import { Priority, Task } from '../models/task.model';

const STORAGE_KEY = 'taskboard-v1';

function uid(): string {
  return crypto.randomUUID();
}

const INITIAL_BOARD: Column[] = [
  {
    id: 'col-todo',
    title: 'To Do',
    color: '#0052cc',
    tasks: [
      {
        id: 'task-1',
        title: 'Design the landing page',
        description: 'Create wireframes and mockups for the new landing page design.',
        priority: 'high',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-2',
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        priority: 'medium',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-3',
        title: 'Write unit tests',
        description: 'Cover at least 80% of the codebase with unit tests.',
        priority: 'low',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'col-progress',
    title: 'In Progress',
    color: '#ff991f',
    tasks: [
      {
        id: 'task-4',
        title: 'Build authentication module',
        description: 'Implement login, register, and password reset flows.',
        priority: 'high',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-5',
        title: 'API integration',
        description: 'Connect frontend to the REST API endpoints.',
        priority: 'medium',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'col-done',
    title: 'Done',
    color: '#00875a',
    tasks: [
      {
        id: 'task-6',
        title: 'Project setup',
        description: 'Initialize Angular project with routing and SCSS.',
        priority: 'low',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-7',
        title: 'Define data models',
        description: 'Create TypeScript interfaces for Task and Column.',
        priority: 'low',
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly _columns = signal<Column[]>(this.load());
  readonly columns = this._columns.asReadonly();

  private load(): Column[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return INITIAL_BOARD;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Column[]) : INITIAL_BOARD;
    } catch {
      return INITIAL_BOARD;
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._columns()));
  }

  addTask(columnId: string, title: string, description: string, priority: Priority): void {
    const task: Task = {
      id: uid(),
      title: title.trim(),
      description: description.trim(),
      priority,
      createdAt: new Date().toISOString(),
    };
    this._columns.update(cols =>
      cols.map(col => (col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col))
    );
    this.persist();
  }

  updateTask(
    columnId: string,
    taskId: string,
    changes: Partial<Pick<Task, 'title' | 'description' | 'priority'>>
  ): void {
    this._columns.update(cols =>
      cols.map(col =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.map(t => (t.id === taskId ? { ...t, ...changes } : t)) }
          : col
      )
    );
    this.persist();
  }

  deleteTask(columnId: string, taskId: string): void {
    this._columns.update(cols =>
      cols.map(col =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) } : col
      )
    );
    this.persist();
  }

  moveTask(taskId: string, fromColumnId: string, toColumnId: string): void {
    const task = this._columns()
      .find(c => c.id === fromColumnId)
      ?.tasks.find(t => t.id === taskId);
    if (!task) return;

    this._columns.update(cols =>
      cols.map(col => {
        if (col.id === fromColumnId) return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        if (col.id === toColumnId) return { ...col, tasks: [...col.tasks, task] };
        return col;
      })
    );
    this.persist();
  }
}
