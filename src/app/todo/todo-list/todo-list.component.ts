import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent implements OnInit {
  // Subject 동작 방식 - 구독, 값이 어떻게 방출되는지, 구독 순서에 따라 값이 어떻게 변화하는지. => Observable 과 Subject + BehaviorSubject와 Subject 차이점 이해하기
  todos$ = this.todoService.todo$;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

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

  trackById(todo: any): string {
    return todo.id;
  }

  onDelete(id: string): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      //자식 라우트의 파라미터를 쓰기 위해 ActivatedRoute의 snapshot.firstChild로 접근하여 현재 활성화된 자식 라우트의 파라미터를 가져온다.
      const activeId = this.route.snapshot.firstChild?.params['id'];
      if (activeId === id) {
        this.router.navigate(['/todo']);
      }
    });
  }
}

// import { Component } from '@angular/core';
// import { OnInit } from '@angular/core';
// import { TodoService } from '../../services/todo.service';
// import { Subscription } from 'rxjs';
// import { Todo } from '../../../types/todo';

// @Component({
//   selector: 'app-todo-list',
//   templateUrl: './todo-list.component.html',
//   styleUrl: './todo-list.component.css',
// })
// export class TodoListComponent implements OnInit {
//   todos: Todo[] = [];
//   constructor(private todoService: TodoService) {}

//   private subscription = new Subscription();

//   ngOnInit(): void {
//     this.todoService.getTodos().subscribe();
//     this.subscription = this.todoService.todo$.subscribe((todos: Todo[]) => {
//       this.todos = todos;
//     });
//   }

//   ngOnDestroy(): void {
//     this.subscription.unsubscribe();
//   }
// }
// 이후 HTML에서 *ngFor="let todo of todos"로 반복문 돌면서 렌더링
