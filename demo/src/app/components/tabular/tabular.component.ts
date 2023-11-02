import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as sampleData from './account_transactions.json';
import { ApiService } from '../../_services/api.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ngx-app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss']
})
export class TabularComponent implements OnInit {

  @ViewChild('actionCellTmpl', { static: true }) actionCellTmpl: TemplateRef<any>;

  tableList: any = { count: 0, data: [] };
  dynamicFilterData: any = {};
  tableColumns: any = { count: 0, data: [] }
  sort: any;
  pagination: any = { offset: 0, pageSize: 100 };
  filtersDataList: any = {};
  data: any = (sampleData as any).default.data;
  reportCustomization: any;
  id: string;
  datasourceId: string;
  constructor(private route: ActivatedRoute, public http: ApiService) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') == null ? '' : this.route.snapshot.paramMap.get('id');
    if (this.id != '') {
      this.http.get('http://localhost/datalyticsapi/customization/' + this.id).toPromise().then((response) => {
        this.reportCustomization = response;
        this.tableColumns = response['columns'];
        this.datasourceId = response['datasource_id'];
        this.getData();
      });
    } else {
      this.tableColumns = [
        {
          'prop': 'tx_date',
          'alias': {
            '~m~toLong': '~m~tx_date'
          },
          'format': 'dd/MM/yyyy',
          'name': 'Date',
          'sortable': 'label',
          'dataType': 'date',
          'default_sort': 'asc',
          'filterType': 'dateRange',
          'filterUIType': 'date',
          'filter': true,
          'show': true,
          'width': '10%',
          'filterDateRanges': [
            {
              label: 'Today', start: ['startOfDay', {}], end: ['endOfDay', {}]
            },
            { label: 'Yesterday', start: ['startOfDaysub', { 'days': 1 }], end: ['endOfDaysub', { 'days': 1 }] },
            { label: 'Last 7 Days', start: ['startOfDaysub', { 'days': 7 }], end: ['endOfDay', {}] },
            { label: 'Last 30 Days', start: ['startOfDaysub', { 'days': 30 }], end: ['endOfDay', {}] },
            { label: 'This Month', start: ['startOfMonth', {}], end: ['endOfDay', {}] },
            { label: 'Last Month', start: ['startOfMonthsub', { months: 1 }], end: ['endOfMonthsub', { months: 1 }] },
            { label: 'Last 3 Month', start: ['startOfMonthsub', { months: 3 }], end: ['endOfMonthsub', { months: 1 }] },
            { label: 'Last FY', start: ['fyStart', { months: 3, type: 'last' }], end: ['fyEnd', { months: 2, type: 'last' }] },
            { label: 'Current FY', start: ['fyStart', { months: 3 }], end: ['fyEnd', { months: 2 }], isDefault: true },
            { label: 'Next FY', start: ['fyStart', { months: 3, type: 'next' }], end: ['fyEnd', { months: 2, type: 'next' }] },

          ]
        },
        {
          'prop': 'to_by',
          'dataType': 'calculated',
          'columnType': 'formula',
          'alias': {
            '~m~cond': {
              'if': {
                '~m~gt': [
                  '~m~credit',
                  0
                ]
              },
              'then': 'By',
              'else': 'To'
            }
          },
          'show': true,
          'name': '',
          'width': '3%'
        },
        {
          'prop': 'particulars',
          'alias': '~m~account_head.name',
          'name': 'Particulars',
          'dataType': 'text',
          'show': true,
          'filter': true,
          'filterRequired': false,
          'filterUIType': 'typeMultiSelect',
          'filterLabel': 'strDrink',
          'filterApi': {
            url: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=$data',
            type: 'get',
            data: {},
            filters: [{}],
            sort: {}
          },
          'filterId': 'idDrink',
          values: [15997],
          'width': '45%'
        },
        {
          'prop': 'voucher_type',
          'dataType': 'calculated',
          'columnType': 'calculated',
          'alias': {
            '~m~cond': {
              'if': {
                '~m~gt': [
                  '~m~credit',
                  0
                ]
              },
              'then': 'Cash Receipt',
              'else': 'Cash Payment'
            }
          },
          'show': true,
          'name': 'Vch Type',
          'width': '10%'
        },
        {
          'prop': 'voucher_ref_id',
          'sortable': 'voucher',
          'name': 'Vch No',
          'dataType': 'text',
          'filterType': 'text',
          'show': true,
          'filter': true,
          'width': '10%'
        },
        {
          'prop': 'credit',
          'name': 'Debit',
          'format': 'INR',
          'dataType': 'currency',
          'filterConditionType': 'neq',
          'show': true,
          'filter': true,
          'cellClass': 'align-right',
          'textAlign': 'Right',
          'width': '10%',
          'type': 'Sum'

        },
        {
          'prop': 'debit',
          'name': 'Credit',
          'format': 'INR',
          'dataType': 'currency',

          'show': true,
          'textAlign': 'Right',
          'width': '10%',
          // 'formula': { "$div": [{ "$mul": [1000, 5000] }, 2] }JSON.stringify(row)
        },
        {
          prop: '_id',
          name: 'Action',
          show: true,
          dataType: 'text',
          // cellTemplate: this.actionCellTmpl
        }
      ];
      this.getData();
    }

  }
  callAPI(data) {

    const filterDetails = this.tableColumns.filter((value) => {
      return value.prop === data.filter;
    })[0];
    this.http.get(filterDetails.filterApi.url.replace('$data', data.searchString.term)).subscribe((response) => {
      filterDetails.filterData = response['drinks'];
      this.dynamicFilterData = { column: data.filter, data: response['drinks'] };
    });
  }
  getData(filterData: any = []) {
    // if (this.id) {
    //   this.http.post('http://localhost/datalyticsapi/getdata/' + this.id).toPromise().then((response) => {
    //     console.log(response);
    //     this.tableList = response;
    //   });
    // } else {
    console.log(this.pagination.offset, this.pagination.pageSize);

    // setTimeout(() => {
    this.tableList = {

      data: this.data.slice(this.pagination.offset * this.pagination.pageSize, this.pagination.pageSize)
      , count: this.data.length, totals: []
    };
    // }, 3000);
    // }

  }
  pageChange($data: any) {
    this.pagination = $data;
    this.getData();
  }
  applySort(sorting: any) {
    this.sort = sorting;
    this.getData();
  }


  getGenderData = (searchString) => {
    const filters = { gender: '' };
    filters.gender = searchString;
  }

  search(filterData: any) {
    // Api call with filter condition and set the data to this.tableList
    this.getData(filterData);
  }

  addReportCustomization(data) {
  }
  changeColumns() {
    this.tableColumns = [...[
      {
        'prop': 'tx_date',
        'alias': {
          '~m~toLong': '~m~tx_date'
        },
        'format': 'dd/MM/yyyy',
        'name': 'Date',
        'sortable': 'label',
        'dataType': 'date',
        'default_sort': 'asc',
        'filterType': 'dateRange',
        'filterUIType': 'date',
        'filter': true,
        'show': true,
        'width': '10%',
        'filterDateRanges': [
          {
            label: 'Today', start: ['startOfDay', {}], end: ['endOfDay', {}]
          },
          { label: 'Yesterday', start: ['startOfDaysub', { 'days': 1 }], end: ['endOfDaysub', { 'days': 1 }] },
          { label: 'Last 7 Days', start: ['startOfDaysub', { 'days': 7 }], end: ['endOfDay', {}] },
          { label: 'Last 30 Days', start: ['startOfDaysub', { 'days': 30 }], end: ['endOfDay', {}] },
          { label: 'This Month', start: ['startOfMonth', {}], end: ['endOfDay', {}] },
          { label: 'Last Month', start: ['startOfMonthsub', { months: 1 }], end: ['endOfMonthsub', { months: 1 }] },
          { label: 'Last 3 Month', start: ['startOfMonthsub', { months: 3 }], end: ['endOfMonthsub', { months: 1 }] },
          { label: 'Last FY', start: ['fyStart', { months: 3, type: 'last' }], end: ['fyEnd', { months: 2, type: 'last' }] },
          { label: 'Current FY', start: ['fyStart', { months: 3 }], end: ['fyEnd', { months: 2 }], isDefault: true },
          { label: 'Next FY', start: ['fyStart', { months: 3, type: 'next' }], end: ['fyEnd', { months: 2, type: 'next' }] },

        ]
      },
      {
        'prop': 'to_by',
        'dataType': 'calculated',
        'columnType': 'formula',
        'alias': {
          '~m~cond': {
            'if': {
              '~m~gt': [
                '~m~credit',
                0
              ]
            },
            'then': 'By',
            'else': 'To'
          }
        },
        'show': true,
        'name': '',
        'width': '3%'
      },
      {
        'prop': 'particulars',
        'alias': '~m~account_head.name',
        'name': 'Particulars',
        'dataType': 'text',
        'show': true,
        'filter': true,
        'filterRequired': false,
        'filterUIType': 'typeMultiSelect',
        'filterLabel': 'strDrink',
        'filterApi': {
          url: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=$data',
          type: 'get',
          data: {},
          filters: [{}],
          sort: {}
        },
        'filterId': 'idDrink',
        values: [15997],
        'width': '45%'
      },
      {
        'prop': 'voucher_type',
        'dataType': 'calculated',
        'columnType': 'calculated',
        'alias': {
          '~m~cond': {
            'if': {
              '~m~gt': [
                '~m~credit',
                0
              ]
            },
            'then': 'Cash Receipt',
            'else': 'Cash Payment'
          }
        },
        'show': true,
        'name': 'Vch Type',
        'width': '10%'
      },
      {
        'prop': 'voucher_ref_id',
        'sortable': 'voucher',
        'name': 'Vch No',
        'dataType': 'text',
        'filterType': 'text',
        'show': true,
        'filter': true,
        'width': '10%'
      },
      {
        'prop': 'credit',
        'name': 'Credit',
        'format': 'INR',
        'dataType': 'number',
        'filterConditionType': 'neq',
        'show': true,
        'filter': true,
        'textAlign': 'Right',
        'width': '10%',
        'type': 'Sum'

      },
      {
        'prop': 'debit',
        'name': 'Debit',
        'format': 'INR',
        'dataType': 'number',

        'show': true,
        'textAlign': 'Right',
        'width': '10%',
        'formula': { "$div": [{ "$mul": [1000, 5000] }, 2] }
      },
      {
        prop: '_id',
        name: 'Action',
        show: true,
        dataType: 'text',
        // cellTemplate: this.actionCellTmpl
      }
    ]];
    // this.tableList = this.tableList;
    this.getData();
  }
}
