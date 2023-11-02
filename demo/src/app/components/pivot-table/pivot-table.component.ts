import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as data from './data.json';

@Component({
  selector: 'app-pivot-table',
  templateUrl: './pivot-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./pivot-table.component.scss']
})
export class PivotTableComponent implements OnInit {
  tableColumns: any[];
  sort: any;
  pagination: any = { offset: 0, pageSize: 25 };
  summaryColumns: any;
  groupColumns: any;
  rowColumns: any;
  // { data: any; count: number; totals: any[]; }
  tableData: any;

  constructor() {
    this.tableColumns = [
      {
        prop: 'name',
        name: 'Name',
        sortable: true,
        show: true,
        dataType: 'text',
        filterType: 'text',
        flexGrow: 2,
        filter: true
      },
      {
        prop: '$tx_date.$date',
        name: 'Date',
        sortable: true,
        show: true,
        dataType: 'text',
        filterType: 'text',
        flexGrow: 2,
        filter: true
      },
      {
        prop: 'total_amount',
        name: 'Amt',
        sortable: true,
        show: true,
        dataType: 'text',
        filterType: 'text',
        flexGrow: 2,
        filter: true
      },
      {
        prop: 'range',
        name: 'range',
        // TODO Add sortable data
        sortable: [],
        show: true,
        dataType: 'text',
        filterType: 'text',
        flexGrow: 2,
        filter: true
      },
    ];
    this.groupColumns = [{
      prop: 'tx_date', type: 'ageing',
      ageGroups: {
        '(< 180 days)': { below: 180 },
        '( 180 to 250 days)': { from: 180, to: 250 },
        '( 250 to 360 days)': { from: 460, to: 500 },
        '(> 360 days)': { above: 600 }
      }
    }];
    this.rowColumns = [{ prop: 'name', name: 'Product', class: 'text-left' }];
    this.summaryColumns = [
      { prop: 'bal_qty', type: 'sum', name: 'Qty', class: 'text-right' },
      { prop: 'value', type: 'sum', name: 'Value', format: "currency:INR,1.0-2", class: 'text-right' }];

    this.getData();

  }

  ngOnInit(): void {

  }
  getData() {
    this.tableData = data['default'];

  }
  getFormat(format) {
    return format.split(':');
  }
}
