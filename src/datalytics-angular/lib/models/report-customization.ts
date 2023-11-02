import { TemplateRef } from '@angular/core';


const enum dataTypeEnum {
  Text = 'text',
  Date = 'date',
  Boolean = 'option',
  Number = 'number'
}
const enum summaryType {
  Sum = 'sum',
  Min = 'min',
  Max = 'max',
  Avg = 'avg',
  Distinct = 'distinctcount',
}
export class ConfigOptions {
  actionType: string;
  data: any;
  report_name?: string;
  report_type: string;
}
export class ReportCustomization {

  report_name: string;
  filters: Filter[] = [];
  columns: CustomizationColumn[] = [];
  apiurl: string;
  menuName: string;
  permissions: number[] = [];
  default_filter: Filter = new Filter();
  no_of_rows = 50;
  closing_balance_switch: boolean;
  opening_balance?: OBAndCB = new OBAndCB();
  closing_balance?: OBAndCB = new OBAndCB();
  opening_balance_switch: boolean;
  report_type: REPORT_TYPE;
  side_by_side: [string, string];
}

export type REPORT_TYPE = 'table' | 'pivot_table' | 'chart' | 'card' | 'side_by_side';

export class Filter {
  column: string;
  type: string;
  value: { [key: string]: any }[] | string | boolean;
}

export class CustomizationColumn {
  prop: string;
  name: string;
  sortable?: string = null;
  flexGrow?: number;
  show?: boolean = true;
  isDetailedRow?: boolean;
  filter?: boolean;
  cellTemplate?: TemplateRef<any>;
  pipe?: string;
  cellClass?: string;
  rowClass?: string;
  conditionalClass?: string;
  dataType?: string;
  summaryRow?: string;
  isGroup?: boolean;
  format?: string;
  filterAPI?: string[];
  getFilterDataByFunction?: Function;
  postSummary?: boolean;
  preSummary?: boolean;
  summary?: boolean;
  filterType?: string;
  filterLabel?: string;
  filterId?: string;
  filterApi: FilterApi = new FilterApi();
  textLeft: string;
  textMiddle: string;
  textRight: string;
  filters?: DefaultFilters[] = [];
  alias: any;
  width_type: string;
  width: any;
  filterValueType: string;
  filterUIType: string;

}
export class FilterApi {
  url: string;
  method: string;
  params: Params[] = [];
  filters: any;
}
export class Params {
  key: string;
  value: string;
}
export class DefaultFilters {
  type: string;
  value: string;
  min_value: string;
  max_value: string;
  multiple_type: string;
  columnName: string;
  is_type?: boolean;
}

export class OBAndCB {
  date_column: string;
  display_text: string;
  group_columns: any;
  text_column: string;
  columns: OBAndCBColumns[] = [];
}

export class OBAndCBColumns {
  prop: string;
  name: string;
  alias: string;

}
