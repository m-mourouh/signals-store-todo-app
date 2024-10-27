import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../store/todo.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  http = inject(HttpClient);
  constructor() { }

  getTodos(): Observable<Todo[]>{
    return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/user/1/todos');
  }
}
