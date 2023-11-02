import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, OnInit } from '@angular/core';
import { Column } from '../../models/column';
// import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import differenceInDays from 'date-fns/differenceInDays'
@Component({
  selector: 'datalytics-pivot-table',
  templateUrl: './pivot-table.component.html',
  styleUrls: ['./pivot-table.component.scss']
})
export class PivotTableComponent implements OnInit, OnChanges {
  showLoadingBar: boolean;
  _data: any;
  _count: number;
  @Input() keepColumns: any = [];
  @Input() groupColumns: any = [];
  @Input() summaryColumns: any = [];
  @Output() sortChange = new EventEmitter();
  @Input() virtualScroll = false;
  @Input() settings = { rowTotal: false, columnTotal: false, rowTotalText: 'Row Total', columnTotalText: 'Col Total', rowTotalPosition: 'end' };
  _columns: Column[] = [];
  valueColumnSeparator = String.fromCharCode(0);
  groupColumnSeparator = String.fromCharCode(9);
  keepColumnSeparator = String.fromCharCode(10);
  tableHeader: any[][];
  ageingGroups: any;
  maxHeaderRow: number;
  formatting: any = [];
  columnTotalValues: unknown[];

  constructor() {
  }
  @Input()
  get data() {
    return this._data;
  }
  set data(value: { data: any[]; count: number; }) {
  }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this._setData(changes.data.currentValue || []);
    }
    if (changes.keepColumns) {
      this.keepColumns = changes.keepColumns.currentValue;
      // this.createCrossTabArray();
    }
    if (changes.groupColumns) {
      this.groupColumns = changes.groupColumns.currentValue;
      // this.createCrossTabArray();
    }
    if (changes.summaryColumns) {
      this.summaryColumns = changes.summaryColumns.currentValue;
      // this.createCrossTabArray();
    }


  }
  private _setData(data: any[]) {

    this._data = data;
    this.createCrossTabArray();

  }
  calculateAgeing() {

    this._data.forEach((row, rowIndex) => {
      this.ageingGroups.forEach(groupcolumn => {
        let interval = differenceInDays(new Date, new Date(row[groupcolumn.prop]));
        Object.keys(groupcolumn.ageGroups).forEach(groupname => {
          if (typeof groupcolumn.ageGroups[groupname].from != 'undefined' && typeof groupcolumn.ageGroups[groupname].from != 'undefined') {
            if (interval >= groupcolumn.ageGroups[groupname].from && interval <= groupcolumn.ageGroups[groupname].to) {
              this._data[rowIndex][groupcolumn.prop] = groupname;
            }
          }
          if (typeof groupcolumn.ageGroups[groupname].above != 'undefined') {
            if (interval > groupcolumn.ageGroups[groupname].above) {
              this._data[rowIndex][groupcolumn.prop] = groupname;
            }
          }
          if (typeof groupcolumn.ageGroups[groupname].below != 'undefined') {
            if (interval < groupcolumn.ageGroups[groupname].below) {
              this._data[rowIndex][groupcolumn.prop] = groupname;
            }
          }
        });
      });
    });
    let sortedData = [];
    let row = 0;
    this.ageingGroups.forEach((groups) => {
      Object.keys(groups.ageGroups).forEach(groupName => {
        if (typeof sortedData[row] == 'undefined') {
          sortedData[row] = {};
        }
        sortedData[row][groups.prop] = groupName;
        row++;
      })
    });
    this._data = sortedData.concat(this._data);
  }
  createCrossTabArray() {

    let formattedData: any = {};
    let rowToColumn: any = {};
    let resultData: any = [];
    // Check for Ageing
    this.ageingGroups = this.groupColumns.filter(column => { return column.type == 'ageing'; });
    if (this.ageingGroups.length > 0) {
      this.calculateAgeing();
    }
    let row = 0;
    let groupColumnsSort: boolean | [] = this.ageingGroups.length > 0 ? false : true;
    let col = 0;
    this._data.forEach(row => {
      let keepColumnsValue: any = [];
      let groupColumnsValue: any = [];
      this.keepColumns.forEach(column => {
        keepColumnsValue.push((row[column.prop]) ? row[column.prop] : "--");
      });
      keepColumnsValue = keepColumnsValue.join(this.keepColumnSeparator);
      this.groupColumns.forEach(column => {
        groupColumnsValue.push(row[column.prop] ? row[column.prop] : '');
      });
      groupColumnsValue = groupColumnsValue.join(this.groupColumnSeparator);
      this.summaryColumns.forEach(column => {
        let groupColumnsValueAndValueColumn = groupColumnsValue + this.valueColumnSeparator + column.prop;
        if (typeof formattedData[keepColumnsValue] == 'undefined') {
          formattedData[keepColumnsValue] = {};
        }
        if (typeof formattedData[keepColumnsValue][groupColumnsValueAndValueColumn] == 'undefined') {
          formattedData[keepColumnsValue][groupColumnsValueAndValueColumn] = 0;
        }
        if (isNaN(rowToColumn[groupColumnsValueAndValueColumn])) {
          rowToColumn[groupColumnsValueAndValueColumn] = 0;
        }
        switch (column.type) {
          case 'sum':
            formattedData[keepColumnsValue][groupColumnsValueAndValueColumn] += row[column.prop];
            rowToColumn[groupColumnsValueAndValueColumn] += row[column.prop];
            break;
          case 'count':
            formattedData[keepColumnsValue][groupColumnsValueAndValueColumn]++;
            rowToColumn[groupColumnsValueAndValueColumn] += row[column.prop];
            break;
          default:
            formattedData[keepColumnsValue][groupColumnsValueAndValueColumn] = row[column.prop];
            break;
        }
        ;
      });
    });
    resultData[row] = {};
    this.keepColumns.forEach(column => {
      resultData[row][column.prop] = column.prop;
    });
    if (this.settings.rowTotal == true && this.settings.rowTotalPosition == 'start') {
      this.summaryColumns.forEach(col => {
        let totalColumn = [this.settings.rowTotalText, col.prop].join(this.valueColumnSeparator);
        resultData[row][totalColumn] = col.prop;
      });
    }

    let rowToColumnKeys = Object.keys(rowToColumn);
    let columnTotals = {}
    if (groupColumnsSort) {
      rowToColumnKeys.sort();
    }
    rowToColumnKeys.forEach(groupedColumn => {
      resultData[row][groupedColumn] = groupedColumn;
      if (this.settings.columnTotal == true) {
        columnTotals[groupedColumn] = rowToColumn[groupedColumn];
      }
    });

    if (this.settings.rowTotal == true && this.settings.rowTotalPosition == 'end') {
      this.summaryColumns.forEach(col => {
        let totalColumn = [this.settings.rowTotalText, col.prop].join(this.valueColumnSeparator);
        resultData[row][totalColumn] = col.prop;
      });
    }

    row++;
    let keepColumnData = Object.keys(formattedData);
    keepColumnData.sort();
    keepColumnData.forEach(columnData => {
      let column: number = 0;
      let keepColumns = columnData.split(this.keepColumnSeparator);
      resultData[row] = {};
      keepColumns.forEach(keepcol => {
        resultData[row][column] = keepcol;
        column++
      });
      rowToColumnKeys.forEach(rtc => {
        let rtcValue = rtc.split(this.valueColumnSeparator);
        resultData[row][column] = formattedData[columnData][rtc];
        if (this.settings.rowTotal == true) {
          let valueColumnName = rtcValue[rtcValue.length - 1];
          let totalColumn = [this.settings.rowTotalText, valueColumnName].join(this.valueColumnSeparator);

          if (typeof resultData[row][totalColumn] == 'undefined')
            resultData[row][totalColumn] = 0;
          if (typeof formattedData[columnData][rtc] !== 'undefined')
            resultData[row][totalColumn] += formattedData[columnData][rtc];
        }

        column++
      });
      row++;
    });


    this.tableHeader = this.createCrossTabHeader(resultData.shift());
    this.maxHeaderRow = this.tableHeader.length - 1;

    if (this.ageingGroups.length > 0) {
      resultData.shift();
    }
    if (this.settings.columnTotal == true) {
      this.columnTotalValues = [];
      // let data =new Array(this.keepColumns.length-1).fill(''); 
      // data.push(this.settings.columnTotalText);
      // console.log(JSON.stringify(data.fill(0, 0, 10)))
      if (this.settings.rowTotal == true && this.settings.rowTotalPosition == 'start') {
        this.columnTotalValues = this.columnTotalValues.concat(new Array(this.summaryColumns.length).fill(''));
      }
      this.columnTotalValues = this.columnTotalValues.concat(Object.values(rowToColumn));
      if (this.settings.rowTotal == true && this.settings.rowTotalPosition == 'end') {
        this.columnTotalValues = this.columnTotalValues.concat(new Array(this.summaryColumns.length).fill(''));
      }
      // resultData=resultData.concat(data);
      console.log(this.columnTotalValues);

    }
    this._data = resultData;
  }
  createCrossTabHeader(header) {

    header = Object.keys(header);
    let totalHeaderRows = header[this.keepColumns.length].split(this.groupColumnSeparator).length + 1;
    let result: any[][] = [];
    // Getting the first line data to get key values
    let cols = 0;
    header.forEach((colHeader, index) => {
      let i = 0;

      let data = { name: colHeader, isgrouped: false };
      if (typeof result[i] == 'undefined') {
        result[i] = [];
      }
      if (index >= this.keepColumns.length) {
        data.isgrouped = true;
        let groupColumns = colHeader.split(this.groupColumnSeparator);
        let valueColumns = groupColumns[groupColumns.length - 1].split(this.valueColumnSeparator);
        groupColumns.forEach((groupName, index) => {

          if (index == groupColumns.length - 1) {
            groupName = groupName.split(this.valueColumnSeparator)[0];
          }
          if (result[i][result[i].length - 1].name == groupName) {
            result[i][result[i].length - 1]['cols']++;

          } else {
            result[i].push({ cols: 1, rows: 1, name: groupName });
          }

          i++;
          if (typeof result[i] == 'undefined') {
            result[i] = [];
          }
          valueColumns.forEach((valueColumn, valueIndex) => {
            let customization = this.getColumnDefinition(valueColumn, 'summary');
            // this.formatting[valueIndex]['class']=this.formatting[column]['class']+' rowTotal';
            console.log(valueColumn, customization);


            if (typeof customization !== 'undefined' && valueIndex > 0) {
              let data = { cols: 1, rows: 1, name: '' };
              // console.log(data);
              // console.log(customization);


              data['name'] = customization['name'] ? customization['name'] : valueColumn;
              if (typeof this.formatting[cols] == 'undefined') {
                this.formatting[cols] = { class: '', format: '' };
              }
              this.formatting[cols]['class'] = customization['class'] ? customization['class'] : '';
              if (customization['format']) {
                this.formatting[cols]['format'] = customization['format'].split(':')[0];
                this.formatting[cols]['formatStyle'] = (customization['format'].split(':')[1]).split(',');
              }

              if (this.settings.rowTotal == true && this.settings.rowTotalText == groupName) {

                this.formatting[cols]['class'] += ' rowTotal';
              }
              result[i].push(data);
              cols++;
            }
          });
        });


      } else {
        let customization = this.getColumnDefinition(colHeader, 'row');
        let data = { cols: 1, rows: totalHeaderRows };
        data['name'] = customization?.name ? customization['name'] : colHeader;
        if (typeof this.formatting[cols] == 'undefined') {
          this.formatting[cols] = {};
        }
        this.formatting[cols]['class'] = customization?.class ? customization['class'] : '';
        if (customization?.format) {
          this.formatting[cols]['format'] = customization?.format.split(':');
        }
        result[i].push(data);
        cols++;
      }

    });
    return result;

  }
  getColumnDefinition(value: string, type: string, key: string = 'prop', multi: boolean = false) {
    let search: any;
    if (type == 'summary') {
      search = this.summaryColumns;
    }
    if (type == 'group') {
      search = this.groupColumns;
    }
    if (type == 'row') {
      search = this.keepColumns;
    }
    if (multi == true)
      return search.filter(col => col[key] == value);
    else
      return search.filter(col => col[key] == value)[0];
  }
  // Move to filters
  getObjectKeys(Obj: any) {
    if (typeof Obj === 'object') {
      return Object.keys(Obj);
    } else {
      return [];
    }

  }

}