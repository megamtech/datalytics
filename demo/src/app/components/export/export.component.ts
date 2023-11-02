import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'datalytics-report-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  @Input() pdf = true;
  @Input() excel = true;
  @Input() API = true;
  @Input() generate: 'local' | 'remote' = 'remote';
  constructor() { }

  ngOnInit(): void {
  }
  exportPDF() {

  }
  exportExcel() {

  }
}
