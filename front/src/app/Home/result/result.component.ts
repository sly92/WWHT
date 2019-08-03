import { Component, Input, OnInit, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
	selector: 'app-result',
	templateUrl: './result.componentdynamic.html',
	styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit{

	@Input() result : any;
	dates = [];
	date:string;
	res ={};
	objectKeys = Object.keys;
	history =[];
	noHistory=false;
	noPrediction=false;

	datePrediction=""

	constructor(private router: Router) {
		
	}
		

	ngOnInit(){
	this.dates=[]
	this.noHistory=false
	this.noPrediction=false

		if(!this.isEmpty(this.result["history"])){
      this.result['history'].forEach(item =>{
			item['date'] = this.formatDateString(item['date'].SQLDATE.toString())
    })
    }
    else {
      this.result['history']=[{}];
      this.noHistory=true;
	}

	if(!this.isEmpty(this.result["predicted"]['prediction'])){
	this.datePrediction=this.formatDateString(this.result.formData.date)
    }
     else {
     	this.result['predicted']['prediction']=[{}];
     	this.noPrediction=true;
     }

     this.res = this.result;  
}

  formatDateString(date)
  {
    var a = moment(date, "YYYYMMDD");
      a.format("MMM Do YYYY");
      return a["_d"].toString().substr(0, 11)
  }
	isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

	back(){
		location.reload();
	}
}
