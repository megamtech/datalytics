import { DatafilterPipe } from './../../pipes/datafilter.pipe';
import { DatePipe, CurrencyPipe } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  SimpleChanges,
  Inject,
  forwardRef,
  HostListener,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ElementRef,

} from '@angular/core';
import { ArrayFillfilterPipe } from '../../pipes/arrayfill.pipe';
import { FormulaPipe } from '../../pipes/formula.pipe';
import { Column } from '../../models/column';
@Component({
  selector: 'datalytics-tabular-report',
  templateUrl: './tabular-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tabular-report.component.scss'],
})
export class TabularReportComponent implements OnInit, OnChanges {


  @Input() pageSize = 5;
  @Input() class = 'material striped';
  @Input() rowClass = '';

  @Input() virtualScroll = false;
  @Input() serverSideSort: any;
  @Input() offset: any = 0;
  @Input() prePostStyle = 'block';
  @Input() defaultSort: { prop: string, dir: string }[] | [] = [];

  @Input() summaryColumns: { position: 'top' | 'bottom' | 'both', pageTotal: {} | null, grandTotal: {} | null, height: number, class: string } | null =
    { position: 'bottom', pageTotal: null, grandTotal: null, height: 25, class: 'text-primary' };
  @Output() pageChange = new EventEmitter();
  @Output() sortChange = new EventEmitter();
  @ViewChild('summaryCell', { static: true }) summaryCell!: TemplateRef<any>;
  // tslint:disable-next-line:variable-name
  _data = { result: [], count: 0 };
  _columns: Column[];
  // tslint:disable-next-line:variable-name
  _count: number;
  // @ViewChild('inlineTemplates',{static:true}) inlineTempinlineTemplateslates: QueryList < CtrlTemplateDirective > ;
  pagination: any = {};
  _locale: { no_records: string } = { 'no_records': 'No Records found' };
  columnMode: any;
  showLoadingBar = true;
  showSummaryRow = false;
  _totals: any = {
    pre: [],
    post: [],
    grandTotal: [],
  };
  groupExpansion = true;
  groupRowsBy: string | boolean = false;

  currencyColumns: any = {};
  formulaColumns: any = {};
  dateColumns: any = {};
  datafilterPipe: DatafilterPipe;
  arrayfillPipe: ArrayFillfilterPipe;
  // datepipe: DatePipe;
  // currencyPipe: CurrencyPipe;
  formulaPipe: FormulaPipe;
  _pageSize: any = new Array(5);
  height: any = {};
  width: any = {};
  @Input() id: string = 'datalytics_tbl_' + Math.floor(Math.random() * 10000000) + 1
  loaderColumns: any = [];
  loadingData: any = [];
  enableSummary: boolean = false;
  pageTotal: any = {};
  grandTotal: any = {};

  constructor(
    @Inject(forwardRef(() => DatafilterPipe)) datafilterPipe: DatafilterPipe,
    @Inject(forwardRef(() => ArrayFillfilterPipe)) arrayfillPipe: ArrayFillfilterPipe,
    private datepipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    @Inject(forwardRef(() => FormulaPipe)) formulaPipe: FormulaPipe,
  ) {
    this.datafilterPipe = datafilterPipe;
    this.arrayfillPipe = arrayfillPipe;
    // this.datepipe = datepipe;
    // this.currencyPipe = currencyPipe;
    this.formulaPipe = formulaPipe;
    this.getScreenSize();

    for (let i = 1; i <= this.pageSize; i++) {
      this.loadingData.push({});
    }
  }

  @Input()
  get columns(): Column[] {

    return this._columns;
  }
  set columns(value: Column[]) {
    this._columns = value;
    this.transformColumns();
  }
  @Input()
  get data() {
    return this.formatData(this.data);
  }

  set data(value: { data: any[]; count: number; totals?: any }) {
    this._data.result = value.data;
    this._data.count = value.count;
  }
  @Input()
  set locale(data: any) {
    this._locale.no_records = data.no_records ? data.no_records : this._locale.no_records;
  }
  get locale() {
    return this._locale;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this._setData(changes.data.currentValue || []);
    }
    if (changes.columns) {

      this.columns = [...changes.columns.currentValue];
      this.initColumns();
    }
    if (changes.pageSize) {
      this._pageSize = new Array(changes.pageSize.currentValue);
    }
    if (changes.pageSize) {
      this._pageSize = new Array(changes.pageSize.currentValue);
    }
    if (changes.offset) {
      this.offset = changes.offset.currentValue;
    }
    if (changes.defaultSort) {
      this.defaultSort = changes.defaultSort.currentValue;
    }

  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.height['window'] = window.innerHeight;
    this.width['window'] = window.innerWidth;
  }
  ngAfterViewInit() {

    console.log(this.summaryCell)
  }
  transformColumns() {
    // tslint:disable-next-line:prefer-const
    let columns = [];
    this.loaderColumns = [];
    console.log(this._columns);
    this._columns.forEach((column, index) => {
      column.field = column.prop;
      column.headerText = column.name;
      column.allowSorting = column.sortable;
      if (this.summaryColumns.grandTotal != null) {
        this.enableSummary = true;
      }

      if (this.summaryColumns.pageTotal != null) {
        this.enableSummary = true;
      }
      if (this.enableSummary) {
        column.summaryFunc = (cells) => {
          let summary_column = '<div>'
          if (this.summaryColumns.pageTotal[column.prop] !== undefined) {
            let data = this.summaryColumns.pageTotal[column.prop];
            if (column.dataType == 'currency' && !isNaN(data))
              data = this.currencyPipe.transform(data, column.format);
            summary_column += '<div class="' + this.summaryColumns.class + ' ' + column.cellClass + '">' +
              data
              +
              '</div>';
          }
          if (this.summaryColumns.grandTotal[column.prop] !== undefined) {
            let data = this.summaryColumns.grandTotal[column.prop];
            if (column.dataType == 'currency' && !isNaN(data))
              data = this.currencyPipe.transform(data, column.format);
            summary_column += '<div class="' + this.summaryColumns.class + ' ' + column.cellClass + '">' +
              data
              + '</div>';
          }
          summary_column += '</div>';
          return summary_column;
        };
      }
      if (column.dataType === 'currency') {
        this.currencyColumns[column.prop] = index;
      }
      if (column.dataType === 'date') {
        this.dateColumns[column.prop] = index;
      }
      if (column.formula != '' && column.formula != undefined && column.formula != null) {
        this.formulaColumns[column.prop] = index;
      }
      columns.push(column);
      if (column.show == true) {
        this.loaderColumns.push({ name: column.name, width: column.width });
      }
    });


    this._data.result = this._data.result;
    this._columns = [...columns];
  }
  customRowPipe(pipe, row) {
    return pipe.transform(row);
  }

  private _setData(data: { data: any[]; count: number; totals?: any }) {
    this._data = { result: [], count: 0 };
    this._data.result = this.formatData(data.data);
    this._data.count = data.count;
    this.pagination['pageCount'] = data.count / this.pageSize;
    this.showLoadingBar = false;
  }
  getColumnDisplayName(columnName: string) {
    return this.getColumnDetails(columnName)['name'];
  }
  getColumnDetails(columnName: string) {
    return this.datafilterPipe.transform(this.columns, 'prop', columnName)[0];
  }
  onPageChangeEvent($data) {
    this.showLoadingBar = true;
    $data.offset = $data.offset == undefined ? 0 : $data.offset;
    $data.limit = $data.limit;
    this.pageChange.emit($data);
  }
  onSortChangeEvent($data) {
    this.showLoadingBar = true;
    this.sortChange.emit($data);
  }
  ngOnInit() {
    this.pagination = { pageSize: this.pageSize, limit: this.pageSize, offset: 0 };
    this.initColumns();

  }
  initColumns() {
    const summaries = this.datafilterPipe.transform(this.columns, 'summaryType');
    const flexGrowColumns = this.datafilterPipe.transform(this.columns, 'flexGrow');
    this.columns = this.datafilterPipe.transform(this.columns, '!show', false);
    if (flexGrowColumns.length > 0) {
      this.columnMode = 'flex';
      this.columns = this.arrayfillPipe.transform(this.columns, 'flexGrow', 1);
    } else {
      this.columnMode = 'force';
    }
  }
  onDetailToggle(data) {

  }
  toggleExpandGroup(data) {

  }
  setColumnMode() {

  }
  getCellClass({ row, column, value }) {
    return column;
  }

  getRowHeight() {
    if (this.virtualScroll) {
      return 50;
    } else {
      return 'auto';
    }
  }


  dataBound() {
    // this.grid.autoFitColumns(['ShipAddress', 'ShipName']);
  }
  getObjectKeys(Obj) {
    return Object.keys(Obj);
  }
  formatData(data: any) {
    const rows: any = [];
    if (data !== undefined) {
      data.forEach((row) => {
        Object.keys(this.formulaColumns).forEach((col) => {
          const colIndex = this.formulaColumns[col];
          const columnDetails = this.columns[colIndex];
          if (row[col] !== '' && typeof row[col] !== 'undefined') {
            row[col] = this.formulaPipe.transform(row, columnDetails.formula, data);
          }
        });
        Object.keys(this.currencyColumns).forEach((col) => {
          const colIndex = this.currencyColumns[col];
          const columnDetails = this.columns[colIndex];
          if (!isNaN(row[col])) {
            row[col] = this.currencyPipe.transform(row[col], columnDetails.format);
          }
        });
        Object.keys(this.dateColumns).forEach((col) => {
          const colIndex = this.dateColumns[col];
          const columnDetails = this.columns[colIndex];
          if (row[col] !== '' && typeof row[col] !== 'undefined') {
            row[col] = this.datepipe.transform(new Date(row[col]), columnDetails.format);
          }
        });
        rows.push(row);
      });
    }
    data = rows;
    this.showLoadingBar = true;
    return data;
  }
}


