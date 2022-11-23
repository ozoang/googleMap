import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogService } from '../service/dialog.service';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css']
})
export class LocationDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<LocationDialogComponent>,
    private dialog: DialogService
  ) { }

  ngOnInit(): void {
  }

}
