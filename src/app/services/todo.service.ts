import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  todo$ = this.todoSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTodos(options?: {
    sort?: string;
    order?: string;
    priorityFilter?: string;
    keyword?: string;
    countOnly?: boolean;
  }): Observable<TodoResponse> {
    return this.http
      .get<TodoResponse>(`${this.baseUrl}/todos`, {
        params: options ?? {},
      })
      .pipe(
        tap((response) => {
          this.todoSubject.next(response.data);
        }),
      );
  }

  getTodoById(id: string): Observable<TodoDetailResponse> {
    return this.http.get<TodoDetailResponse>(`${this.baseUrl}/todos/${id}`);
  }

  createTodo(
    title: string,
    content: string,
    priority: 'urgent' | 'normal' | 'low',
  ): Observable<TodoDetailResponse> {
    return this.http
      .post<TodoDetailResponse>(`${this.baseUrl}/todos`, {
        title,
        content,
        priority,
      })
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
      .put<TodoDetailResponse>(`${this.baseUrl}/todos/${id}`, {
        title,
        content,
        priority,
      })
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
      .patch<TodoDetailResponse>(`${this.baseUrl}/todos/${id}/complete`, {})
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
    return this.http.delete<TodoResponse>(`${this.baseUrl}/todos/${id}`).pipe(
      tap(() => {
        const current = this.todoSubject.getValue();

        this.todoSubject.next(current.filter((todo) => todo.id !== id));
      }),
    );
  }
}
