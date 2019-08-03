import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FormControl} from '@angular/forms';
import { DataService } from '../../_shared/services/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import {Data} from '../../_shared/services/models/data.model';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import * as moment from 'moment';

@Component({
  selector: 'app-prediction-form',
  templateUrl: './prediction-form.component.html',
  styleUrls: ['./prediction-form.component.scss']
})
export class PredictionFormComponent implements OnInit {
  startDate = new Date(1990, 0, 1);
  minDate = new Date(2000, 0, 1);

  picker_date: any;
  data: Data[];
  obj ={}


  // dataCtrlTags: FormControl;
  dataCtrlActors: FormControl;
  dataCtrlActors2: FormControl

  // filteredDatasTags: Observable<any[]>;
  filteredDatasActors: Observable<any[]>;
  filteredDatasActors2: Observable<any[]>;

  submitted : any;

  @Input() datas : any;
  @Input() datas1 : any;
  @Input() datas2 : any;
  @Output() messageEvent = new EventEmitter();

  constructor(private router: Router, private dataService : DataService) { }

  model = new Data(null,null,null);


  ngOnInit() {
    this.submitted = false;
    this.startDate = new Date();
    this.minDate = new Date();
    
   // 
   this.dataCtrlActors = new FormControl();
   this.filteredDatasActors  = this.dataCtrlActors.valueChanges
   .pipe(
    startWith(''),
    map(data => data ? this.filterData(data, this.datas) : this.datas.slice())
    );

   this.dataCtrlActors2 = new FormControl();
   this.filteredDatasActors2  = this.dataCtrlActors2.valueChanges
   .pipe(
    startWith(''),
    map(data => data ? this.filterData(data, this.datas) : this.datas.slice())
    );
 }

 async search(){
   this.submitted = true;
   if(this.picker_date){
     this.model.date=this.formatDate(this.picker_date);

     if(typeof(this.model)!='undefined'){
      
      var actor1 = this.model.actor1
      var actor2 = this.model.actor2
      var tmp1 = this.datas.find(function(element) {
        if(element.Code == actor1)
          return element.Nom;
      });
      var tmp2 = this.datas.find(function(element) {
        if(element.Code == actor2)
          return element.Nom;
      });

      var toSend = {"actor1":tmp1.Nom,"actor2":tmp2.Nom, "date":this.model.date}
      const prediction = await this.dataService.getPrediction(this.model)

      this.obj = {
        formData:toSend,
        predicted: prediction,
        history:[]
      }

    this.dataService.getHistory(this.model).then(res =>
    {
      
      if(this.isEmpty(res))
        this.messageEvent.emit(this.obj)
      else {
        
         res.forEach(item => {
          this.dataService.getAction(item["EventCode"]).subscribe(res =>{
             item["Action"]=res["Action"]
        })
           this.obj["history"].push(item)
       })
          
          this.messageEvent.emit(this.obj);
     }

      });
  }

}
}



isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

saveDate(event: MatDatepickerInputEvent<Date>) {
  this.picker_date = new Date(event.value);
}


reset_search(){
  this.model = new Data(null,null,null);

}

formatDate(date){
  return ""+date.getFullYear()+(date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
}



filterData(name: string, datas: any) {
  return datas.filter(data =>
    data.Nom.toLowerCase().indexOf(name.toLowerCase()) === 0);
}
}
