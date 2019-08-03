import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule 
  ],
  declarations:[
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
    FormsModule
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
