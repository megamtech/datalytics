import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportDataComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
