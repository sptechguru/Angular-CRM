import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'capitalizefirst'
})
export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    if (value === null) return 'Not assigned';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}

@Pipe({
  name: 'customdate'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: Date) {
    var datePipe = new DatePipe("en-US");
    return datePipe.transform(value, 'dd/MM/yyyy');
  }
}