import { AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Inject } from '@angular/core';
import { ApiService } from '../../_services/api.service';

@Component({
  selector: 'app-report-customization',
  templateUrl: './report-customization.component.html',
  styleUrls: ['./report-customization.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportCustomizationComponent implements OnInit {
  @ViewChild('actionTemplate', { static: true }) actionTemplate: TemplateRef<any>;
  reportCustomizations = { data: [], count: 0 };
  tableColumns = [];
  constructor(
    // @Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef,
    public http: ApiService
  ) { }
  // data: any = {
  //   // '_id': ObjectId('5f63778103ecb31ca0d53f43'),
  //   'report_name': 'Cash Book',
  //   'url': '/report/cashbook',
  //   'columns': [
  //     {
  //       'prop': 'tx_date',
  //       'alias': {
  //         '~m~toLong': '~m~tx_date'
  //       },
  //       'format': 'dd/MMM/yyyy',
  //       'name': 'Date',
  //       'sortable': 'label',
  //       'dataType': 'date',
  //       'default_sort': 'asc',
  //       'filterUIType': 'dateRange',
  //       'filterLabel': 'name',
  //       'filterId': 'id',
  //       'filter': true,
  //       'show': true,
  //       'filterDateRanges': [
  //         {
  //           'label': 'Today',
  //           'start': [
  //             'startOfDay',
  //             {}
  //           ],
  //           'end': [
  //             'endOfDay',
  //             {}
  //           ]
  //         },
  //         {
  //           'label': 'Yesterday',
  //           'start': [
  //             'startOfDaysub',
  //             {
  //               'days': 1
  //             }
  //           ],
  //           'end': [
  //             'endOfDaysub',
  //             {
  //               'days': 1
  //             }
  //           ]
  //         },
  //         {
  //           'label': 'Last 7 Days',
  //           'start': [
  //             'startOfDaysub',
  //             {
  //               'days': 7
  //             }
  //           ],
  //           'end': [
  //             'endOfDaysub',
  //             {
  //               'days': 7
  //             }
  //           ]
  //         },
  //         {
  //           'label': 'Last 30 Days',
  //           'start': [
  //             'startOfDaysub',
  //             {
  //               'days': 30
  //             }
  //           ],
  //           'end': [
  //             'endOfDaysub',
  //             {
  //               'days': 30
  //             }
  //           ]
  //         },
  //         {
  //           'label': 'This Month',
  //           'start': [
  //             'startOfMonth',
  //             {}
  //           ],
  //           'end': [
  //             'endOfDay',
  //             {}
  //           ]
  //         },
  //         {
  //           'label': 'Last Month',
  //           'start': [
  //             'startOfMonthsub',
  //             {
  //               'months': 1
  //             }
  //           ],
  //           'end': [
  //             'endOfMonthsub',
  //             {
  //               'months': 1
  //             }
  //           ]
  //         },
  //         {
  //           'label': 'Last 3 Month',
  //           'start': [
  //             'startOfMonthsub',
  //             {
  //               'months': 3
  //             }
  //           ],
  //           'end': [
  //             'endOfMonthsub',
  //             {
  //               'months': 1
  //             }
  //           ]
  //         }
  //       ],
  //       'width': '10%'
  //     },
  //     {
  //       'prop': 'toby',
  //       'dataType': 'calculated',
  //       'columnType': 'calculated',
  //       'alias': {
  //         '~m~cond': {
  //           'if': {
  //             '~m~gt': [
  //               '~m~credit',
  //               0
  //             ]
  //           },
  //           'then': 'To',
  //           'else': 'By'
  //         }
  //       },
  //       'show': true,
  //       'name': '',
  //       'width': '5%'
  //     },
  //     {
  //       'prop': 'particulars',
  //       'alias': {
  //         '~m~cond': {
  //           'if': {
  //             '~m~in': [
  //               '',
  //               [
  //                 '~m~party_name'
  //               ]
  //             ]
  //           },
  //           'then': {
  //             '~m~cond': {
  //               'if': {
  //                 '~m~gt': [
  //                   '~m~credit',
  //                   0
  //                 ]
  //               },
  //               'then': '~m~debit_ledger.name',
  //               'else': '~m~credit_ledger.name'
  //             }
  //           },
  //           'else': '~m~party_name'
  //         }
  //       },
  //       'name': 'Particulars',
  //       'dataType': 'text',
  //       'show': true,
  //       'filter': false,
  //       'width': '30%'
  //     },
  //     {
  //       'prop': 'voucher_type',
  //       'dataType': 'calculated',
  //       'columnType': 'calculated',
  //       'alias': {
  //         '~m~cond': {
  //           'if': {
  //             '~m~gt': [
  //               '~m~credit',
  //               0
  //             ]
  //           },
  //           'then': 'Cash Payment',
  //           'else': 'Cash Receipt'
  //         }
  //       },
  //       'show': true,
  //       'name': 'Vch Type'
  //     },
  //     {
  //       'prop': 'account_head.parent_id',
  //       'filter': true,
  //       'dataType': 'text',
  //       'filterUIType': 'typeMultiSelect',
  //       'filterRequired': true,
  //       'filterLabel': 'strDrink',
  //       'filterId': 'idDrink',
  //       'filterApi': {
  //         'url': 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=$data',
  //         'method': 'get',
  //         'filters': '',
  //         'sort': ''
  //       },
  //       'show': false,
  //       'name': 'Ledger'
  //     },
  //     {
  //       'prop': 'voucher_ref_id',
  //       'sortable': 'voucher',
  //       'name': 'Vch No',
  //       'dataType': 'text',
  //       'show': true,
  //       'filter': false
  //     },
  //     {
  //       'prop': 'credit',
  //       'name': 'Credit',
  //       'format': 'INR',
  //       'dataType': 'currency',
  //       'filterUIType': 'currency',
  //       'filter': true,
  //       'show': true,
  //       'textAlign': 'Right'
  //     },
  //     {
  //       'prop': 'debit',
  //       'name': 'Debit',
  //       'format': 'INR',
  //       'dataType': 'currency',
  //       'filterUIType': 'currency',
  //       'filter': true,
  //       'show': true,
  //       'textAlign': 'Right'
  //     }
  //   ],
  //   'apiurl': 'reports',
  //   'filters': [
  //     {
  //       'column': 'account_head.parent_id',
  //       'type': 'in',
  //       'value': [
  //         1031
  //       ]
  //     },
  //     {
  //       'column': 'payment_method',
  //       'type': 'eq',
  //       'value': 1031
  //     },
  //     {
  //       'column': 'company_id',
  //       'type': 'eq',
  //       'value': '~~m~company_id'
  //     }
  //   ],
  //   'default_filter': [
  //     {
  //       'column_name': 'company_id',
  //       'filter_type': '',
  //       'values': [
  //         'm~company_id'
  //       ]
  //     }
  //   ],
  //   'opening_balance': {
  //     'columns': [
  //       {
  //         'prop': 'debit',
  //         'name': 'Debit',
  //         'alias': {
  //           '~m~cond': {
  //             'if': {
  //               '~m~gte': [
  //                 {
  //                   '~m~subtract': [
  //                     '~m~debit',
  //                     '~m~credit'
  //                   ]
  //                 },
  //                 0
  //               ]
  //             },
  //             'then': {
  //               '~m~subtract': [
  //                 '~m~debit',
  //                 '~m~credit'
  //               ]
  //             },
  //             'else': 0
  //           }
  //         },
  //         'show': true
  //       },
  //       {
  //         'prop': 'credit',
  //         'name': 'Credit',
  //         'alias': {
  //           '~m~cond': {
  //             'if': {
  //               '~m~gte': [
  //                 {
  //                   '~m~subtract': [
  //                     '~m~credit',
  //                     '~m~debit'
  //                   ]
  //                 },
  //                 0
  //               ]
  //             },
  //             'then': {
  //               '~m~subtract': [
  //                 '~m~credit',
  //                 '~m~debit'
  //               ]
  //             },
  //             'else': 0
  //           }
  //         },
  //         'show': true
  //       }
  //     ],
  //     'group_columns': {
  //       '_id': null,
  //       'credit': {
  //         '~m~sum': '~m~credit'
  //       },
  //       'debit': {
  //         '~m~sum': '~m~debit'
  //       }
  //     },
  //     'date_column': 'tx_date'
  //   },
  //   'closing_balance': {
  //     'columns': [
  //       {
  //         'prop': 'debit',
  //         'name': 'Debit',
  //         'alias': {
  //           '~m~cond': {
  //             'if': {
  //               '~m~gte': [
  //                 {
  //                   '~m~subtract': [
  //                     '~m~debit',
  //                     '~m~credit'
  //                   ]
  //                 },
  //                 0
  //               ]
  //             },
  //             'then': {
  //               '~m~subtract': [
  //                 '~m~debit',
  //                 '~m~credit'
  //               ]
  //             },
  //             'else': 0
  //           }
  //         },
  //         'show': true
  //       },
  //       {
  //         'prop': 'credit',
  //         'name': 'Credit',
  //         'alias': {
  //           '~m~cond': {
  //             'if': {
  //               '~m~gte': [
  //                 {
  //                   '~m~subtract': [
  //                     '~m~credit',
  //                     '~m~debit'
  //                   ]
  //                 },
  //                 0
  //               ]
  //             },
  //             'then': {
  //               '~m~subtract': [
  //                 '~m~credit',
  //                 '~m~debit'
  //               ]
  //             },
  //             'else': 0
  //           }
  //         },
  //         'show': true
  //       }
  //     ],
  //     'group_columns': {
  //       '_id': null,
  //       'credit': {
  //         '~m~sum': '~m~credit'
  //       },
  //       'debit': {
  //         '~m~sum': '~m~debit'
  //       }
  //     },
  //     'date_column': 'tx_date'
  //   }
  // };

  // ngAfterViewInit() {
  //   // this.actionTemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
  //   // this.actionTemplate.elementRef.nativeElement.propName = 'actionTemplate';
  // }
  ngOnInit(): void {
    this.http.post('http://localhost/datalyticsapi/customization/list', { filters: {} }).toPromise().then((response: any) => {
      this.reportCustomizations = response;
    });
    this.tableColumns = [
      { prop: 'report_name', name: 'Name', dataType: 'text', show: true },
      { prop: 'url', dataType: 'text', show: true },
      {
        prop: '_id', show: true, dataType: 'text',
        // tslint:disable-next-line:max-line-length
        // template: '<a class="btn btn-primary" href="./tabular">Edit</a>'
        template: this.actionTemplate
      }
    ];

  }
  addReportCustomization(abc) { }
  pageChange($event) {

  }
  applySort($event) {

  }


  deleteCustomization(muid: string) {
    this.http.get('http://localhost/datalyticsapi/customization/delete/' + muid).toPromise().then((response) => {
      // console.log(response);
      console.log(response);
    });
  }
}
