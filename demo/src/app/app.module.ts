// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
// Components
import { AppComponent } from './app.component';
import { DatalyticsAngularModule } from '../../../src/datalytics-angular/public_api';
import { TabularComponent } from './components/tabular/tabular.component';
import { FiltersComponent } from './components/filters/filters.component';
import { PivotTableComponent } from './components/pivot-table/pivot-table.component';

// Services
import { ApiService } from './_services/api.service';

// Pipes
import { ConstantService } from './_config/constants';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReportCustomizationComponent } from './components/report-customization/report-customization.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsComponent } from './components/charts/charts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExportComponent } from './components/export/export.component';
import { ReportCustomizationAddComponent } from './components/report-customization-add/report-customization-add.component';
import { DatasourceComponent } from './components/datasource/datasource.component';
import { DatasourceAddComponent } from './components/datasource/datasource-add/datasource-add.component';
import { DesignerComponent } from './components/designer/designer.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    TabularComponent,
    FiltersComponent,
    PivotTableComponent,
    AppComponent,
    ReportCustomizationComponent,
    ChartsComponent,
    DashboardComponent,
    ExportComponent,
    ReportCustomizationAddComponent,
    DatasourceComponent,
    DatasourceAddComponent,
    DesignerComponent,
  ],
  imports: [
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DatalyticsAngularModule.forRoot({
      BASE_URL: '',
      api: {
        list: 'datalyticsapi/customization/list',
        add: 'datalyticsapi/customization/$id'
      }
    }),
    NgbModule,
    DragDropModule,
    // ngfModule,
    // DatePipe
  ],
  providers: [
    ConstantService,
    ApiService,
    DatePipe,
    CurrencyPipe
  ],
  bootstrap: [AppComponent],
  exports: []
})

export class AppModule { }
