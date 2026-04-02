import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { TodoResponse, TodoDetailResponse, Todo } from '../../types/todo';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private baseUrl = 'http://localhost:8080';
  private todoSubject = new BehaviorSubject<Todo[]>([]);
  //behaviorSubject를 private로 선언하여 외부에서 직접 접근하지 못하도록 하고, 대신 todo$라는 public Observable을 통해 구독할 수 있도록 한다.
  todo$ = this.todoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getTodos(
    sort?: string,
    order?: string,
    priorityFilter?: string,
    keyword?: string,
    countOnly?: boolean,
  ): Observable<TodoResponse> {
    const params: any = {};

    if (sort) params['sort'] = sort;
    if (order) params['order'] = order;
    if (priorityFilter) params['priorityFilter'] = priorityFilter;
    if (keyword) params['keyword'] = keyword;
    if (countOnly) params['countOnly'] = countOnly;

    return this.http
      .get<TodoResponse>(`${this.baseUrl}/todos`, {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
        params,
      })
      .pipe(
        tap((response) => {
          this.todoSubject.next(response.data);
        }),
      );
  }

  getTodoById(id: string): Observable<TodoDetailResponse> {
    return this.http.get<TodoDetailResponse>(`${this.baseUrl}/todos/${id}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  createTodo(
    title: string,
    content: string,
    priority: 'urgent' | 'normal' | 'low',
  ): Observable<TodoDetailResponse> {
    return this.http
      .post<TodoDetailResponse>(
        `${this.baseUrl}/todos`,
        {
          title,
          content,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${this.authService.getToken()}`,
          },
        },
      )
      .pipe(
        tap((res) => {
          const current = this.todoSubject.getValue();

          this.todoSubject.next([...current, res.data]);
        }),
      );
  }

  updateTodo(
    title: string,
    content: string,
    priority: 'urgent' | 'normal' | 'low',
    id: string,
  ): Observable<TodoDetailResponse> {
    return this.http
      .put<TodoDetailResponse>(
        `${this.baseUrl}/todos/${id}`,
        {
          title,
          content,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${this.authService.getToken()}`,
          },
        },
      )
      .pipe(
        tap((res) => {
          const current = this.todoSubject.getValue();

          this.todoSubject.next(
            current.map((todo) => (todo.id === id ? res.data : todo)),
          );
        }),
      );
  }

  toggleComplete(id: string): Observable<TodoDetailResponse> {
    return this.http
      .patch<TodoDetailResponse>(
        `${this.baseUrl}/todos/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.authService.getToken()}`,
          },
        },
      )
      .pipe(
        tap((res) => {
          const current = this.todoSubject.getValue();
          this.todoSubject.next(
            current.map((todo) => (todo.id === id ? res.data : todo)),
          );
        }),
      );
  }

  deleteTodo(id: string): Observable<TodoResponse> {
    return this.http
      .delete<TodoResponse>(`${this.baseUrl}/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      })
      .pipe(
        tap(() => {
          const current = this.todoSubject.getValue();

          this.todoSubject.next(current.filter((todo) => todo.id !== id));
        }),
      );
  }
}
