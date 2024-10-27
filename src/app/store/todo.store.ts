import { computed, effect, inject } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Todo } from './todo.model';
import { TodoService } from '../services/todo.service';

const todosStoreKey = 'todos_store'
type TodoFilter = 'all' | 'completed' | 'active';

type TodoState = {
  todos: Todo[];
  loading: boolean;
  filter: TodoFilter;
};

const initialState: TodoState = {
  todos: [],
  loading: false,
  filter: 'all',
};

export const todoStore = signalStore(
  { providedIn: 'root' },
  withState<TodoState>(initialState),
  withComputed(({ todos, filter }) => ({
    completedTodos: computed(() => todos().filter((todo) => todo.completed)),
    filteredTodos: computed(() => {
      switch (filter()) {
        case 'active':
          return todos().filter((todo: Todo) => !todo.completed);
        case 'completed':
          return todos().filter((todo: Todo) => todo.completed);
        default:
          return todos();
      }
    }),
  })),
  withMethods((store, _todoService = inject(TodoService)) => ({
    loadTodos(): void {
      patchState(store, { loading: true });
      _todoService.getTodos().subscribe({
        next: todos => patchState(store, { todos }),
        error: err => console.error("Error loading todos", err),
        complete: () => patchState(store, { loading: false }),
      });
    },
    addTodo(todoTitle: string): void {
      patchState(store, (state) => ({
        todos: [
          {
            id: Date.now().toString(),
            title: todoTitle,
            completed: false,
          },
          ...state.todos,
        ],
      }));
    },
    toggleTodo(id: string): void {
      patchState(store, (state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      }));
    },
    setFilter(filter: TodoFilter): void {
      patchState(store, { filter });
    },
  })),
  withHooks({
    onInit(store) {
      // const todosFromLocalStorage = JSON.parse(localStorage.getItem(todosStoreKey) || '[]')
      // patchState(store, {
      //   todos: todosFromLocalStorage
      // })
      //it combine changes and react to the last change version
      effect(() => {
        const state = getState(store);

        // localStorage.setItem(todosStoreKey, JSON.stringify(state.todos))
        console.log('Effect', state);
      });
      //executed each time the state changed (first) (tracking every change)
      // watchState(store, (state) => {
      //   console.log('WatchState', state);
      // });
    },
  })
);
