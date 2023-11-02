import { TemplateRef } from '@angular/core';
import { Filter } from './filter';

const enum dataTypeEnum {
    Text = 'text',
    Date = 'date',
    Boolean = 'option',
    Number = 'number',
    Currency = 'currency'
}
const enum summaryType {
    Sum = 'sum',
    Min = 'min',
    Max = 'max',
    Avg = 'avg',
    Distinct = 'distinctcount',
}
export interface FilterDateRange {

    'label': string;
    'start': [string, StartEndDate];
    'end': [string, StartEndDate];

}
export type startEndType = 'add' | 'sub';
export interface StartEndDate {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}
export interface API {

    url: string;
    type?: 'get' | 'post';
    data?: Object;
    filters?: [Object];
    sort?: Object;

}
export class Column {
    prop: string;
    name: string;
    sortable?: boolean;
    show?: boolean;
    filter?: boolean;
    cellClass?: string;
    rowClass?: string;
    conditionalClass?: string;
    dataType?: dataTypeEnum;
    aggregateType?: summaryType;
    format?: string;
    filterAPI?: API;
    filterDateRanges?: FilterDateRange[];
    isDefaultFilter?: boolean;
    filterData?: { name: string, value: string | number }[];
    textAlign?: string;
    filterRequired?: boolean;
    // tslint:disable-next-line:no-inferrable-types
    filterType?: string | { name: string, prop: string, icon: string } = 'text';
    filterTypes?: { name: string, prop: string, icon: string }[];
    width?: any = '';
    // Need to removed after removing syncfusion component and creating custom component
    field?: string;
    headerText?: string;
    allowSorting?: boolean;
    formula?: string = '';
    summaryTemplate?: any;
    summaryFunc?: any;
}
