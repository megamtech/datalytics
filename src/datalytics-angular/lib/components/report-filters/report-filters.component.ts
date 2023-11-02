import { FilterConditionTypes } from './../../models/filter';
import { Column, FilterDateRange } from './../../models/column';
import { FilterPipe } from '../../pipes/filter.pipe';
import { DatafilterPipe } from '../../pipes/datafilter.pipe';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
  ViewChild,
  forwardRef,
  Inject,
} from '@angular/core';
import { startOfDay, endOfDay, sub, add, startOfMonth, endOfMonth, format } from 'date-fns';
import { NgbDropdown, NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

// import { isObject } from 'util';
// import { IAngularMyDpOptions, IMyDateModel } from "angular-mydatepicker";
// import { ConstantService } from "src/app/_config/constants";
export class Notification {
  reason: string;
  // tslint:disable-next-line:no-inferrable-types
  type: string = 'error';
  // tslint:disable-next-line:no-inferrable-types
  isDismissable: boolean = true;
}
@Component({
  selector: 'datalytics-report-filters',
  templateUrl: './report-filters.component.html',
  styleUrls: ['./report-filters.component.scss'],
  providers: [NgbDropdownConfig]
})
export class ReportFiltersComponent implements OnInit, OnChanges {
  @Output() getFilterData: EventEmitter<any> = new EventEmitter<any>();
  @Output() getFilterTypeaheadData: EventEmitter<any> = new EventEmitter<any>();
  @Input() name: string;
  @Input() filters: any;
  @Input() inputSize: any;
  @Input() dynamicFilterData: any = { data: [], prop: '', default: [] };
  @Input() recentSearches: any = [];
  @Input() searchOnLoad = true;
  @Input() filterGroups: any = [];
  @Input() displayInline = false;
  @Input() settings = {
    title: '',
    title_class: '',
    help: true,
    buttons: [
      // { name: 'Add', class: 'btn btn-primary', icon: 'fa fa-plus', url: '/abcs' }
    ],
    search: { name: 'Search', class: 'btn btn-primary', icon: 'fa fa-search' },
    clear: { name: 'Clear', class: 'btn btn-default mr-5', icon: 'fa fa-close' }
  };
  filterData: any = {};
  filterDataArray: any = [];
  filterDropDown: any;
  currentSelectedFilter = '';
  defaultConditionTypes: any[] = [
    { name: 'Contains', condition: 'contains', icon: '[A-Z]' }, // 0:
    { name: 'Starts with', condition: 'startswith', icon: '[A-Z' }, // 1:
    { name: 'Ends with', condition: 'endswith', icon: 'A-Z]' }, // 2:
    { name: 'Greater than equals', condition: 'gte', icon: '>=' }, // 3:
    { name: 'Lesser than equals', condition: 'lte', icon: '<=' }, // 4:
    { name: 'Equals', condition: 'eq', icon: '==' }, // 5:
    { name: 'Not Equals ', condition: 'neq', icon: '!=' }, // 6:
    { name: 'In', condition: 'in', icon: '[A,B,C]' }, // 7:
    { name: 'Not In', condition: 'notin', icon: '[A,B,C]' }, // 8:
    { name: 'Between', condition: 'between', icon: 'A-Z' }, // 9:
    { name: 'Greater than ', condition: 'gt', icon: '>' }, // 10:
    { name: 'Lesser than ', condition: 'lt', icon: '<' }, // 11:


  ];
  filterTypes: {} = {
    text: [
      0, 1, 2, 5, 6
    ],
    number: [
      3, 4, 5, 6, 10, 11
    ],
    currency: [
      3, 4, 5, 6, 10, 11
    ],

    typeMultiSelect: [
      7, 8
    ],
    typeSelect: [
      7, 8
    ],
    date: [
      3, 4, 5, 6, 9, 10, 11
    ],
  };
  filterDateOptions: any = {
    format: 'dd/MMM/yyyy', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'dd/MMM/yyyy', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' To ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Okay', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
  };
  currentIndex: number;
  filterDropDownValues: any;
  addFilterDropDown: any;
  filterColumn: any;
  filterCondition: any;
  conditionType = 1;
  currentFilter: any = false;
  currentFilterValue: any;
  currentFilters: any = [];
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  filterArray: any = [];
  selectedColumnFilterTypes: any[];
  mandateFilters: any;
  errors: Notification[] = [];
  datafilterPipe: DatafilterPipe;
  paste_values: string = '';
  paste_filter: string = '';
  separator: string = '';
  constructor(
    @Inject(forwardRef(() => DatafilterPipe)) datafilterPipe: DatafilterPipe,
    private config: NgbDropdownConfig,
    private modalService: NgbModal
  ) {
    this.datafilterPipe = datafilterPipe;
  }

  ngOnInit() {
    this.inputSize = this.inputSize ? this.inputSize : 'col-3';
    this.filters = this.datafilterPipe.transform(this.filters, 'filter', true);
    // this.displayInline = this.filters.length <= 4 ? true : false;
    // this.setFiltersDateRange();
    this.mandateFilters = this.datafilterPipe.transform(this.filters, 'filterRequired', true);
    if (this.mandateFilters.length > 0) {
      this.searchOnLoad = false;
    }


    this.setDefaultfilters();
    this.setMandateFilters();
    if (this.displayInline === true) {
      this.setFilters();
    }
    this.setFiltersDateRange();
    if (this.searchOnLoad) {
      this.search();
    }

    this.filterDropDownValues = this.datafilterPipe.transform(this.formatFilters(this.filters), '!filterRequired', true);
  }
  formatFilters(data) {
    data.forEach((filter) => {
      filter.filterUIType = filter.filterUIType ? filter.filterUIType : filter.dataType;
      // filter.sort = 1;
      filter.filterRequired = filter.filterRequired ? filter.filterRequired : false;
    });
    return data;
  }
  setMandateFilters() {
    this.mandateFilters.forEach((filter) => {
      // tslint:disable-next-line:prefer-const
      let currentFilter = filter;
      currentFilter.values = [];
      currentFilter.dataType = currentFilter.dataType ? currentFilter.dataType : 'text';
      currentFilter.filterUIType = currentFilter.filterUIType ? currentFilter.filterUIType : 'text';
      currentFilter.filterConditionTypes = this.getFilterTypes(currentFilter.dataType, currentFilter.filterUIType);
      currentFilter.filterType = currentFilter.filterConditionTypes[0];
      this.filterArray.push(currentFilter);
    });
  }
  setFilters() {
    this.filters.forEach((filter) => {

      if (filter.filter === true && filter.filterRequired !== true) {
        // tslint:disable-next-line:prefer-const
        let currentFilter = filter;

        currentFilter.values = [];
        currentFilter.dataType = currentFilter.dataType ? currentFilter.dataType : 'text';
        currentFilter.filterUIType = currentFilter.filterUIType ? currentFilter.filterUIType : currentFilter.dataType;
        currentFilter.filterConditionTypes = this.getFilterTypes(currentFilter.dataType, currentFilter.filterUIType);
        if (currentFilter.filterConditionType !== undefined) {
          // TODO Dynamic filter condition
          currentFilter.filterType = currentFilter.filterConditionTypes.filter(type => type.condition === currentFilter.filterConditionType)[0];
        } else {
          currentFilter.filterType = currentFilter.filterConditionTypes[0];
        }

        this.filterArray.push(currentFilter);
      }
    });
  }
  @HostListener('document:keydown', ['$event'])
  selectFilter(event) {

    if (event.ctrlKey === true && event.keyCode === 13) {
      this.search();
    }
    if (event.ctrlKey === true && event.keyCode === 46) {
      this.clear();
    }
  }
  getFilterColumns() {

    return this.filters;
  }
  getFilterDropdownValues(filter: any) {
    if (typeof filter.getFilterDataByFunction === 'function') {
      filter.getFilterDataByFunction().subscribe(result => {
        filter.filterData = result.response;
      });
    }
  }
  ngOnChanges(changes: SimpleChanges) {

    if (changes.dynamicFilterData && typeof changes.dynamicFilterData.currentValue?.column !== 'undefined') {
      this.setTypeaheadSearchData(changes.dynamicFilterData.currentValue.column, changes.dynamicFilterData.currentValue.data, changes.dynamicFilterData.currentValue.values);
    }

  }
  setFiltersDateRange() {
    this.filters.forEach((filter, index) => {
      if (filter.filterUIType === 'date') {
        filter.format = filter.format ? filter.format : 'dd/MM/yyyy';
        if (typeof filter.filterDateRanges !== 'undefined') {
          filter.filterDateRanges.forEach(dateRange => {
            if (Array.isArray(dateRange.start)) {
              dateRange.start = this.convertToDateRange(dateRange.start);
            }
            if (Array.isArray(dateRange.end)) {
              dateRange.end = this.convertToDateRange(dateRange.end);
            }
            if (dateRange.isDefault) {
              filter.values = { startDate: dateRange.start, endDate: dateRange.end };
            }
          });
        } else {
          filter.filterDateRanges = [];
          filter.values = { startDate: new Date(), endDate: new Date() }
        }
      }
    });

  }
  convertToDateRange(dateValue) {
    let date: Date = new Date();
    switch (dateValue[0]) {
      case 'startOfDay':
        date = startOfDay(date);
        break;
      case 'endOfDay':
        date = endOfDay(date);
        break;
      case 'startOfDaysub':
        date = startOfDay(sub(date, dateValue[1]));
        break;
      case 'endOfDaysub':
        date = endOfDay(sub(date, dateValue[1]));
        break;
      case 'startOfMonth':
        date = startOfMonth(date);
        break;
      case 'endOfMonth':
        date = endOfMonth(date);
        break;
      case 'startOfMonthsub':
        date = startOfMonth(sub(date, dateValue[1]));
        break;
      case 'endOfMonthsub':
        date = endOfMonth(sub(date, dateValue[1]));
        break;
      case 'fyStart':
        if (typeof dateValue[1]['year'] == 'undefined') {
          let year = date.getFullYear();
          dateValue[1]['year'] = year;
        }
        if (dateValue[1]['type'] == 'last') {

          dateValue[1]['year'] = dateValue[1]['year'] - 1;
        } else if (dateValue[1]['type'] == 'next') {
          dateValue[1]['year'] = dateValue[1]['year'] + 1;
        }
        if (date.getMonth() < dateValue[1]['months']) {
          dateValue[1]['year'] = dateValue[1]['year'] - 1;
        }

        date = startOfMonth(new Date(dateValue[1]['year'], dateValue[1]['months']));
        break;
      case 'fyEnd':
        if (typeof dateValue[1]['year'] == 'undefined') {
          let year = date.getFullYear();
          dateValue[1]['year'] = year;
        }
        if (dateValue[1]['type'] == 'last') {
          dateValue[1]['year'] = dateValue[1]['year'] - 1;
        } else if (dateValue[1]['type'] == 'next') {
          dateValue[1]['year'] = dateValue[1]['year'] + 1;
        }
        if (date.getMonth() > dateValue[1]['months']) {
          dateValue[1]['year'] = dateValue[1]['year'] + 1;
        }
        date = endOfMonth(new Date(dateValue[1]['year'], dateValue[1]['months']));
        break;

      default:
        break;
    }
    return date;
  }
  search() {
    let filters: any = [];
    // tslint:disable-next-line:prefer-const
    let errors: string[] = [];
    this.errors = [];
    this.filterArray.forEach((filter) => {
      if (filter.filter !== true) {
        filters.push(filter);
      }
      if (filter.filterRequired === true && filter.values.length === 0) {
        errors.push(filter.name);
      }
    });
    if (errors.length > 0) {
      const pularlText = errors.length === 1 ? ' is ' : ' are ';
      this.errors.push({
        reason: errors.join(',') + pularlText +
          'Madatory,Values cannot be empty', type: 'danger', isDismissable: false
      });
    } else {
      filters = this.filterDataArray.filter((filter) => {
        return filter.filter !== true;
      });
      filters = filters.concat(this.filterArray);
      // tslint:disable-next-line:prefer-const
      let output = [];


      filters.forEach((filter) => {


        if (
          (filter.filterUIType === 'typeSelect' && filter.values != '' && filter.values != null) ||
          (filter.filterUIType === 'typeMultiSelect' && filter.values.length > 0) ||
          ((filter.filterUIType === 'currency' || filter.filterUIType === 'number' || filter.filterUIType === 'text') && filter.values != '' && filter.values != null) ||
          (filter.filterUIType === 'date' && typeof filter.values == 'object')

        ) {
          let data = {
            column: filter.prop,
            alias: filter.alias ? filter.alias : '',
            dataType: filter.dataType,
            type: filter.filterType,
            value: filter.values,

          };

          if (filter.filterUIType === 'typeSelect' || filter.filterUIType === 'typeMultiSelect') {
            if (typeof filter.filterData !== 'undefined')
              data['text'] = filter.filterData.filter((obj) => obj[filter.filterId] === filter.values);
          }

          output.push(data);
        }
      });
      this.getFilterData.emit(output);
    }
  }
  isArray(data: any) {
    return Array.isArray(data);
  }
  implode(data: []) {
    return '"' + data.join('" , "') + '"';
  }
  clear() {
    this.filterData = {};
    this.filterArray.forEach((filter) => {
      filter.values = [];
    });
    this.getFilterData.emit({});
  }
  // IMP NOTE : The function below should be a lamda function as if this is a eventemmiter
  onChangeTypeahead = (searchString: any) => {
    const filter: any = this.currentSelectedFilter;
    this.getFilterTypeaheadData.emit({ searchString, filter });
  }

  setTypeaheadSearchData(column, data: any[], defaultValues: any = []) {
    if (column !== undefined) {
      const index = this.filterArray.findIndex(filter => filter.prop === column);
      if (data === null) {
        data = [];
      }
      this.filterArray[index].filterData = [...data];
      if (defaultValues.length > 0) {
        this.filterArray[index].values = defaultValues;
      }
    }
  }
  createFilterCondition(filter, filterDetails) {
    switch (filterDetails.dataType) {
      case 'date':
        const dateFilter = filterDetails.filterDateRanges.filter((date) => {
          return date.label === filter.values[0];
        });
        return this.convertToDateRange(dateFilter[0]);
        break;
      case 'number':
        return filter.values;
        break;
      default:
        return filter.values;
    }
  }
  setDefaultfilters() {
    this.filters.forEach(defaultFilter => {
      if (defaultFilter.isDefaultFilter) {
        defaultFilter.defaultFilterCondition.forEach((filter) => {
          this.currentFilters.push(filter.column);
          const values = this.createFilterCondition(filter, defaultFilter);
          filter.values = values;
          filter.name = defaultFilter.name;
          const filterType = this.getFilterType(this.filterTypes[defaultFilter.filterType], filter.filterType);
          filter.filterText = filterType.name;
          filter.filterUIType = defaultFilter.filterType;
          this.filterDataArray.push(filter);
          if (filter.filter) {
            this.filterArray.push(filter);
          }
        });
      }
      if (defaultFilter.filterUIType == 'typeSelect' || defaultFilter.filterUIType == 'typeMultiSelect') {
        let searchString = { term: '' }
        this.getFilterTypeaheadData.emit({ searchString, filter: defaultFilter.prop });
      }

      this.filterData[defaultFilter.prop] = defaultFilter;
    });
  }

  addFilter(filterColumn, filterCondition) {

    this.filterArray.push({
      column: filterColumn.prop,
      name: filterColumn.name,
      dataType: filterColumn.dataType,
      filterType: filterCondition,
      filterUIType: filterColumn.filterType,
      values: filterColumn.values,
      show: true
    });
    this.filterColumn = {};
    this.filterCondition = '';
  }

  getFilterType(filterTypes, filterType) {
    let selectedFilterType;

    filterTypes.forEach((element) => {
      if (this.defaultConditionTypes[element].prop === filterType) {
        selectedFilterType = this.defaultConditionTypes[element];
      }
    });
    return selectedFilterType;
  }
  getFilterTypes(filterType, filterUIType) {
    // tslint:disable-next-line:prefer-const
    let filterTypes = [];
    if (this.displayInline = true) {
      switch (filterUIType) {
        case 'typeMultiSelect':
          filterTypes.push(this.defaultConditionTypes[7]);
          break;
        // case 'typeSelect':
        //   break;
        case 'text':
          filterTypes.push(this.defaultConditionTypes[0]);
          break;
        case 'date':
          filterTypes.push(this.defaultConditionTypes[9]);
          break;
        default:
          filterTypes.push(this.defaultConditionTypes[5]);
          break;
      }
    } else {
      if (filterType != null) {
        filterType = typeof filterType === 'undefined' ? 'text' : filterType;
        this.filterTypes[filterType].forEach((element) => {
          filterTypes.push(this.defaultConditionTypes[element]);
        });
      }
    }
    this.selectedColumnFilterTypes = filterTypes;
    this.filterCondition = filterTypes[0];
    return filterTypes;
  }
  loadFilterTypes(selectedData) {

    const datatype = selectedData.dataType ? selectedData.dataType : 'text';
    this.getFilterTypes(datatype, selectedData.filterUIType);
  }


  removeFilter(index) {
    const currentfilter = this.filterArray[index];
    this.filterArray.splice(index, 1);
    this.currentFilters.splice(this.currentFilters.indexOf(currentfilter.column), 1);
    this.filterDropDownValues = this.filters;
  }

  changeFilterCondition(selectedFilter, filterIndex) {
    this.filterDataArray[filterIndex] = selectedFilter;
  }


  isSingleDateRange(currentFilter, filter) {
    if (this.displayInline === true) {
      return false;
    } else {
      return currentFilter.prop === 'between' ? false : true;
    }
  }
  selectedFilter(filterName) {
    this.currentSelectedFilter = filterName;
  }
  open(content, name) {
    this.paste_filter = name;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  pasteValues(event, filter) {
    console.log(this.paste_filter);
    const separator = this.separator == '' ? '/\r?\n/' : this.separator;
    this.paste_filter['values'] = [];
    this.paste_values.split(separator).forEach(value => {
      if (value != '') {
        this.paste_filter['values'].push(value);
      }
    });
  }
}
