import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TodoService, Todo } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  sortDirection: 'default' | 'asc' | 'desc' = 'default';

  constructor(
    private todoService: TodoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (data: Todo[]) => {
        this.todos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading todos', err)
    });
  }

  get displayedTodos(): Todo[] {
    if (this.sortDirection === 'default') {
      return this.todos;
    }

    return [...this.todos].sort((a, b) =>
      this.sortDirection === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
  }

  toggleTitleSort(): void {
    if (this.sortDirection === 'default') {
      this.sortDirection = 'asc';
      return;
    }

    if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
      return;
    }

    this.sortDirection = 'default';
  }

  get titleSortLabel(): string {
    if (this.sortDirection === 'asc') {
      return 'A → Z';
    }

    if (this.sortDirection === 'desc') {
      return 'Z → A';
    }

    return 'Original';
  }

  exportToCsv(): void {
    const header = ['id', 'title', 'completed'];
    const rows = this.todos.map(todo => [
      todo.id,
      `"${todo.title.replace(/"/g, '""')}"`,
      todo.completed
    ]);

    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
