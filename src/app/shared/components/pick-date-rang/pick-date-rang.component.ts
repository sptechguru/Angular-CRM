import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';


import { DaterangepickerComponent, DaterangepickerConfig } from 'ng2-daterangepicker';

@Component({
  selector: 'app-pick-date-rang',
  templateUrl: './pick-date-rang.component.html',
  styleUrls: ['./pick-date-rang.component.css']
})


export class PickDateRangComponent {

 @Input()   public chosenDate: any = {
     start: null,
    end:null,
  };

  @Input()   public  inputValue: any = {
     start: this.chosenDate.start ?( new Date(this.chosenDate.start).getDate() < 9 ? '0'+ new Date(this.chosenDate.start).getDate() : new Date(this.chosenDate.start).getDate()) + '/' + (new Date(this.chosenDate.start).getMonth()  < 8 ? '0'+(new Date(this.chosenDate.start).getMonth()+1) : new Date(this.chosenDate.start).getMonth() + 1 )+ '/' +  new Date(this.chosenDate.start).getFullYear()  :"",
    end: this.chosenDate.end ? ( new Date(this.chosenDate.end).getDate() < 9 ? '0'+ new Date(this.chosenDate.end).getDate() : new Date(this.chosenDate.end).getDate()) + '/' + (new Date(this.chosenDate.end).getMonth()  < 8 ? '0'+(new Date(this.chosenDate.end).getMonth()+1) : new Date(this.chosenDate.end).getMonth() + 1 )+ '/' +  new Date(this.chosenDate.end).getFullYear() :"",
  };


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  //   this.inputValue = {
  //    start: this.chosenDate.start ?( new Date(this.chosenDate.start).getDate() < 9 ? '0'+ new Date(this.chosenDate.start).getDate() : new Date(this.chosenDate.start).getDate()) + '/' + (new Date(this.chosenDate.start).getMonth()  < 8 ? '0'+(new Date(this.chosenDate.start).getMonth()+1) : new Date(this.chosenDate.start).getMonth() + 1 )+ '/' +  new Date(this.chosenDate.start).getFullYear()  :null,
  //   end: this.chosenDate.end ? ( new Date(this.chosenDate.end).getDate() < 9 ? '0'+ new Date(this.chosenDate.end).getDate() : new Date(this.chosenDate.end).getDate()) + '/' + (new Date(this.chosenDate.end).getMonth()  < 8 ? '0'+(new Date(this.chosenDate.end).getMonth()+1) : new Date(this.chosenDate.end).getMonth() + 1 )+ '/' +  new Date(this.chosenDate.end).getFullYear() :null,
  // };
  }

  @Input() tableMode = true;
  @Output() onQuery = new EventEmitter();
  public picker1 = {
   
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
    // isInvalidDate: function (date: any) {
    //   if (date.isSame('2017-09-26', 'day'))
    //     return 'mystyle';
    //   return false;
    // }
  }

  constructor(private daterangepickerOptions: DaterangepickerConfig , private toster : ToasterService) {
   
    
    this.daterangepickerOptions.settings = {
      locale: { format: 'DD/MM/YYYY' },
      alwaysShowCalendars: false,
      "opens": "right",
      ranges: {
        'Today': [new Date(), new Date()],
        'Last 7 Days': [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
        'Last 14 Days':[new Date(new Date().setDate(new Date().getDate() - 14)), new Date()],
        'Last Month': [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()],
        'Last 3 Months': [new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date()],
        'Last 6 Months': [new Date(new Date().setMonth(new Date().getMonth() - 6)), new Date()],
        'Last 12 Months': [new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date()],
      }
    };
  }
  label  = 'Last 7 Days'



  // inputValue;
  KeyUpCalled(value,key){


    var dateCountTracker;
    var currentDate = value;
    var currentLength = currentDate.length;
   
    var lastNumberEntered = currentDate[currentLength - 1];
    if (currentLength > 10) {
      var res = currentDate.substring(0, 10) 
      this.inputValue[key] = res;
      return  this.inputValue[key]
    }

    

    if ((currentLength == 1  || ((currentDate[0] ==3 && currentDate[1] > 1) && currentLength == 2)) && (currentDate[0] > 3 || currentDate[1] > 1)) {
      var transformedDate = "0" + currentDate[currentLength - 1] + '/'; 
      dateCountTracker = 2;
      currentLength = transformedDate.length;
      this.inputValue[key] = transformedDate;
      return  this.inputValue[key];
    } else if ((currentLength == 4  || (+currentDate.substring(3, 5) > 12 ||( currentLength == 5 ||currentLength == 4 ))) && +currentDate.substring(3, 5) > 12) {  
      var transformedDate = currentDate.substring(0, 3) + "0" + currentDate[currentLength -1] + '/';
      dateCountTracker = 5;
      currentLength = transformedDate.length;
      this.inputValue[key] = transformedDate;
      return  this.inputValue[key];
    } else if (currentLength == 2 && (dateCountTracker != 2 && dateCountTracker != 3)) {
      dateCountTracker = currentLength;
      this.inputValue[key] = currentDate + '/'
      return  this.inputValue[key];
    } else if (currentLength == 5 && (dateCountTracker != 5 && dateCountTracker != 6)) {
      dateCountTracker = currentLength;
      // return currentDate + '/';
      this.inputValue[key] = currentDate + '/'
      return  this.inputValue[key];
    }
    dateCountTracker = currentLength;
    this.inputValue[key] = currentDate;
  }
customDate(){
  
  
  if(!this.inputValue.start && !this.inputValue.end ){
    // console.log('vg');
    
    this.onQuery.emit({start_date : "" , end_date:"" })
    return
  };

   if(this.inputValue.start.lenght === 0 && this.inputValue.end.lenght === 0 ){
    // console.log('vg');
    
    this.onQuery.emit({start_date : "" , end_date:"" })
    return
  };
//  // console.log( new Date(this.inputValue.start) , new Date(this.inputValue.end),this.inputValue.start.substring(6, 11))
  let startDate = new Date(+this.inputValue.start.substring(6, 11),+this.inputValue.start.substring(3, 5)-1,+this.inputValue.start.substring(0,2), 0, 0, 0, 0);
  let endDate = new Date(+this.inputValue.end.substring(6, 11),+this.inputValue.end.substring(3, 5)-1,+this.inputValue.end.substring(0,2), 23, 59, 59, 0);
  
  
  if(isNaN(startDate.getTime())){
    this.toster.Error('Start date in invaild')
    return

  }
  if(isNaN(endDate.getTime())){
    this.toster.Error('End date in invaild')
    return
  }
  if(startDate > endDate){
    this.toster.Error('End Date should be greater then start date')
    return
  }

 

    this.onQuery.emit({start_date : new Date(startDate) , end_date: new Date(endDate) })
  
}
  public selectedDate(value: any, dateInput: any): void {
    // console.log(value);
    // this.label = value.label
    // this.chosenDate.start = value.start;
    // this.chosenDate.end = value.end;
    // this.inputValue.start =( new Date(value.start).getDate() < 9 ? '0'+ new Date(value.start).getDate() : new Date(value.start).getDate()) + '/' + (new Date(value.start).getMonth()  < 8 ? '0'+(new Date(value.start).getMonth()+1) : new Date(value.start).getMonth() + 1 )+ '/' +  new Date(value.start).getFullYear()
    // this.inputValue.end =( new Date(value.end).getDate() < 9 ? '0'+ new Date(value.end).getDate() : new Date(value.end).getDate()) + '/' + (new Date(value.end).getMonth()  < 8 ? '0'+(new Date(value.end).getMonth()+1) : new Date(value.end).getMonth() + 1 )+ '/' +  new Date(value.end).getFullYear()
    // this.onQuery.emit({start_date : new Date(value.start) , end_date:  new Date(value.end)})
  }

  public calendarEventsHandler(e: any): void {
    // // console.log({ calendarEvents: e });
  }

  public applyDatepicker(e: any) {
    // console.log({ applyDatepicker: e.picker });
    const {chosenLabel,endDate,startDate} = e.picker
     this.label = chosenLabel
    this.chosenDate.start =startDate;
    this.chosenDate.end = endDate;
    this.inputValue.start =( new Date(startDate).getDate() < 9 ? '0'+ new Date(startDate).getDate() : new Date(startDate).getDate()) + '/' + (new Date(startDate).getMonth()  < 8 ? '0'+(new Date(startDate).getMonth()+1) : new Date(startDate).getMonth() + 1 )+ '/' +  new Date(startDate).getFullYear()
    this.inputValue.end =( new Date(endDate).getDate() < 9 ? '0'+ new Date(endDate).getDate() : new Date(endDate).getDate()) + '/' + (new Date(endDate).getMonth()  < 8 ? '0'+(new Date(endDate).getMonth()+1) : new Date(endDate).getMonth() + 1 )+ '/' +  new Date(endDate).getFullYear()
    this.onQuery.emit({start_date : new Date(startDate) , end_date:  new Date(endDate)})
  }

  public updateSettings(): void {
    this.daterangepickerOptions.settings.locale = { format: 'DD/MM/YYYY' };
    this.daterangepickerOptions.settings.ranges = {
      'Last 7 Days': [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
        'Last 14 Days':[new Date(new Date().setDate(new Date().getDate() - 14)), new Date()],
        'Last Month': [new Date(new Date().setDate(new Date().getMonth() - 1)), new Date()],
    };
  }}
