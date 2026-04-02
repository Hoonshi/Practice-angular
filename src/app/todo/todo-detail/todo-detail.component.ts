import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../../types/todo';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.css',
})
export class TodoDetailComponent {
  todo: Todo | null = null;
  isEditMode = false;

  todoForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    priority: new FormControl<'urgent' | 'normal' | 'low'>('normal'),
  });

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.todoService
      .getTodoById(id!)
      .subscribe((res) => (this.todo = res.data));
  }

  onEdit(): void {
    if (!this.todo) return;

    this.todoForm.setValue({
      title: this.todo.title,
      content: this.todo.content,
      priority: this.todo.priority,
    });

    this.isEditMode = true;
  }

  onSubmit(): void {
    if (!this.todo) return;

    const { title, content, priority } = this.todoForm.value;
    this.todoService
      .updateTodo(title!, content!, priority!, this.todo.id)
      .subscribe((res) => {
        this.todo = res.data;
        this.isEditMode = false;
      });
  }

  onCancel(): void {
    this.isEditMode = false;
  }
}
