import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { todoStore } from '../store/todo.store';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    MessagesModule,
    ToastComponent,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  todoTitle = signal<string>('');
  readonly store = inject(todoStore);
  readonly tasksCompletedMessage = signal<string>('Congrats, 🎉 you have completed all tasks!');
  toast = viewChild.required(ToastComponent);
  noTasksMessage: Message[] = [{ severity: 'info', detail: 'No todo items' }];

  constructor() {
    effect(() => {
      if (!this.store.loading() && this.store.todos().every(todo => todo.completed)) {
        this.toast().showSuccess(this.tasksCompletedMessage());
      }
    });
  }
  ngOnInit(): void {
    this.store.loadTodos();
  }
  addNewTodo(): void {
    this.store.addTodo(this.todoTitle());
    this.todoTitle.set('');
  }
}
