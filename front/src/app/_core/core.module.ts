import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../_shared/modules/shared.module';
import {RouterModule} from '@angular/router';
import {Error404Component} from './error404/error-404.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
  ],
  declarations: [
    Error404Component
  ],
})

export class CoreModule {
  constructor() {}
}
