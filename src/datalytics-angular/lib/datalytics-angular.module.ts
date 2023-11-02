import {RouterModule} from '@angular/router';

import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TabularReportComponent } from './components/tabular-report/tabular-report.component';
import { PivotTableComponent } from './components/pivot-table/pivot-table.component';
import { ReportFiltersComponent } from './components/report-filters/report-filters.component';
import { ChartsComponent } from './components/charts/charts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterPipe } from './pipes/filter.pipe';
import { DatafilterPipe } from './pipes/datafilter.pipe';
import { ArrayFillfilterPipe } from './pipes/arrayfill.pipe';
import { SafeHtmlPipe } from './pipes/safehtml.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ngxDaterangepicker } from '@megamtech-labs/ngx-datepicker';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
// import { ngfModule, ngf } from 'angular-file';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormulaPipe } from './pipes/formula.pipe';

@NgModule({
  declarations: [
    TabularReportComponent,
    PivotTableComponent,
    ChartsComponent,
    ReportFiltersComponent,
    FilterPipe,
    FormulaPipe,
     DatafilterPipe,
    ArrayFillfilterPipe,
    SafeHtmlPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    NgSelectModule,
    ngxDaterangepicker.forRoot({
      applyLabel: 'Okay',
      firstDay: 3
    }),
    FormsModule,
    DragDropModule,
    // ngfModule,
    NgxDatatableModule
  ],
  providers: [
  ],
  exports: [
    TabularReportComponent,
    PivotTableComponent,
    ReportFiltersComponent,
    ChartsComponent,
    
  ]
  // schemas: [ 
  //   CUSTOM_ELEMENTS_SCHEMA 
  // ]

})
export class DatalyticsAngularModule {
  static forRoot(configuration: DatalyticsConfig): ModuleWithProviders<DatalyticsAngularModule> {
    return {
      ngModule: DatalyticsAngularModule,
      providers: [
        {
          provide: 'Configuration',
          useValue: configuration
        }
      ]
    };
  }
}

export interface DatalyticsConfig {
  BASE_URL?: string;
  api?: {
    list?: string,
    add?: string,
    edit?: string,
    view?: string,
    delete?: string,
  };
}

