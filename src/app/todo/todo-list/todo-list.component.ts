import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent implements OnInit {
  todos$ = this.todoService.todo$;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe();
  }

  onAdd(): void {
    this.todoService
      .createTodo('New Todo', 'This is a new todo item.', 'normal')
      .subscribe();
  }

  onToggle(id: string): void {
    this.todoService.toggleComplete(id).subscribe();
  }

  onDelete(id: string): void {
    this.todoService.deleteTodo(id).subscribe();
  }
}
