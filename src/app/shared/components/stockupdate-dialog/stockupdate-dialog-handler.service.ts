import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {StockupdateDialogComponent, DialogData } from "./stockupdate-dialog.component";

@Injectable({
    providedIn: 'root',
})

export class StokeUpdateDialogHandlerService {
    private dialogRef
    constructor(public dialog: MatDialog) { }

    openDialog(data: DialogData): any {
        console.log("YESS")
        this.dialogRef = this.dialog.open(StockupdateDialogComponent, {
            width: '800px !important',
            data: data
        });

        return this.dialogRef.afterClosed();
        // .subscribe(result => {
        //     // console.log('The dialog was closed : ', result);
        //     this.animal = result;
        // });
    }
}
