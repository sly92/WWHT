import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_CONFIG, AppConfig } from './_core/config/app.config';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './_core/core.module';
import { SharedModule } from './_shared/modules/shared.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Home/home.component';
import { ResultComponent } from './Home/result/result.component';
import { HttpErrorHandler }     from './_core/config/http-error-handler.service';
import { MessageService }     from './_core/config/message.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { PredictionFormComponent } from './Home/prediction-form/prediction-form.component';
import { IsArrayPipe } from './Home/result/arrayify.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResultComponent,
    PredictionFormComponent,
    IsArrayPipe
  ],
  imports: [
    CommonModule,
    FormsModule,                             
    ReactiveFormsModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    SharedModule.forRoot(),
    CoreModule,
    AppRoutingModule
  ],
   providers: [
    Title,
    HttpErrorHandler,
    MessageService,
    {provide: MAT_DATE_LOCALE, useValue: 'fr'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: APP_CONFIG,
      useValue: AppConfig}
    ],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
