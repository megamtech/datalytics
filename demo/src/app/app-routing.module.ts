import { DesignerComponent } from './components/designer/designer.component';
import { DatasourceAddComponent } from './components/datasource/datasource-add/datasource-add.component';
// import { DatasourceAddComponent } from './datasource/datasource-add/datasource-add.component';
import { DatasourceComponent } from './components/datasource/datasource.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TabularComponent } from './components/tabular/tabular.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ReportCustomizationComponent } from './components/report-customization/report-customization.component';
import { PivotTableComponent } from './components/pivot-table/pivot-table.component';
import { ChartsComponent } from './components/charts/charts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportCustomizationAddComponent } from './components/report-customization-add/report-customization-add.component';

const routes: Routes = [
  { path: 'tabular', component: TabularComponent },
  { path: 'tabular/:id', component: TabularComponent },
  { path: 'charts', component: ChartsComponent },
  { path: 'filters', component: FiltersComponent },
  { path: 'customization', component: ReportCustomizationComponent },
  { path: 'customization/:type/:id', component: ReportCustomizationAddComponent },
  { path: 'customization/add', component: ReportCustomizationAddComponent },
  { path: 'pivot', component: PivotTableComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'datasource', component: DatasourceComponent },
  { path: 'designer', component: DesignerComponent },
  { path: 'datasource/add', component: DatasourceAddComponent },
  { path: 'datasource/:type/:id', component: DatasourceAddComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })

  ]
})
export class AppRoutingModule { }
