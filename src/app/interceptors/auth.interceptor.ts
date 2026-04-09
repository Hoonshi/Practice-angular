import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
//implements HttpInterceptor는 인터셉터로서의 역할을 수행하기 위해 필요한 인터페이스를 구현한다는 의미입니다.
//만약 인터셉터가 HttpInterceptor 인터페이스를 구현하지 않으면 ts에러 발생
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.authService.removeToken();
            //임시로 alert로 토큰 에러 알림
            alert('토큰 에러.');
            this.router.navigate(['/login']);
            break;
          case 403:
            this.router.navigate(['/forbidden']);
            break;
          case 500:
            break;
        }
        return throwError(() => error);
      }),
    );
  }
}
