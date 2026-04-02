import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TodoListComponent, TodoDetailComponent],
  imports: [CommonModule, TodoRoutingModule, ReactiveFormsModule],
})
export class TodoModule {}
