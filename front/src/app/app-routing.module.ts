import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppConfig} from './_core/config/app.config';
import {Error404Component} from './_core/error404/error-404.component';
import { HomeComponent } from './Home/home.component';
import { ResultComponent } from './Home/result/result.component'


const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: AppConfig.routes.result, component: ResultComponent },
  {path: AppConfig.routes.error404, component: Error404Component},
  {path: '**', redirectTo: '/' + AppConfig.routes.error404}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
