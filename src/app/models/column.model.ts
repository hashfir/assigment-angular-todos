import { Task } from './task.model';

export interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}
