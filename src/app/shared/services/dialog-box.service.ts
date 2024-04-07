import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class DialogBoxService {

  public dialogRef: MatDialogRef<Component>;

  constructor(private dialog: MatDialog) { }

  // tslint:disable-next-line: no-shadowed-variable
  openmodel(Component,data?){
     this.dialogRef = this.dialog.open(Component,{
      width:" ",data,panelClass:'custom-dialog-container-model',disableClose: true, autoFocus: false
    });
  }

  get dialogBox(){
    return this.dialogRef;
  }
}
