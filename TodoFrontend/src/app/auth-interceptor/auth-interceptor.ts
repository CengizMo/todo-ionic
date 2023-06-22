import { Injectable } from "@angular/core";
import { TodoService } from "../todo.service";
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, from, map, switchMap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private todoService: TodoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.todoService.getToken())
      .pipe(
        switchMap(token => {
          if (token) {
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
        }

        if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }

        return next.handle(req).pipe(
          map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                  // do nothing for now
              }
              return event;
          })
        )}
        )
      )
  }
}
