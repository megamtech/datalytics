import { TemplateRef } from '@angular/core';

// const enum dataTypeEnum {
//     Text = 'text',
//     Date = 'date',
//     Boolean = 'option',
//     Number = 'number'
// };
const enum summaryType {
    Sum = 'sum',
    Min = 'min',
    Max = 'max',
    Avg = 'avg',
    Distinct = 'distinctcount',
};
export interface Column {
    prop: string;
    name: string;
    sortable?: boolean;
    flexGrow?: number;
    show?: boolean;
    isDetailedRow?: boolean;
    filter?: boolean;
    cellTemplate?: TemplateRef<any>;
    pipe?: string;
    class?: string;
    conditionalClass?: string;
    dataType?: string;
    summaryRow?: summaryType;
    isGroup?: boolean;
    filterType?: string;
    callback?: Function;
    inlineTemplate?: string;
}
