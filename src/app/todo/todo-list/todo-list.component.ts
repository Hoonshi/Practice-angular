import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Subscription } from 'rxjs';
import { Todo } from '../../../types/todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  constructor(private todoService: TodoService) {}

  private subscription = new Subscription();

  ngOnInit(): void {
    this.todoService.getTodos().subscribe();
    this.subscription = this.todoService.todo$.subscribe((todos: Todo[]) => {
      this.todos = todos;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
