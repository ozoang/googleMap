import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { LocationDialogComponent } from "../location-dialog/location-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    
    constructor(private matDialog: MatDialog) { }
    private locationDialog!: MatDialogRef<LocationDialogComponent>;

    public positionDialog(): Observable<any> {
        this.locationDialog = this.matDialog.open(LocationDialogComponent);
        return this.locationDialog.afterClosed();
    }
}