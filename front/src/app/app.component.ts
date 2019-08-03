import {Component, Inject} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  
  constructor( private title: Title, private meta: Meta, private snackBar: MatSnackBar) {
    this.title.setTitle("What'll have tomorrow");
  }

}
