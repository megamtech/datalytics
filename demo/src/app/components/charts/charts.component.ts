import { Component, OnInit } from '@angular/core';
import * as sampleData from '../tabular/sample-data.json';

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  //   data: any = [
  //     {
  //         "col5": 1001
  //     }
  // ];
  data: any = [


    {
      "month": "Jan",
      "q": "Q1",
      "sales": 1482,
      "income": 553,
      "expenses": 1673
    },
    {
      "month": "Feb",
      "q": "Q1",
      "sales": 1313,
      "income": 967,
      "expenses": 1007
    },
    {
      "month": "Mar",
      "q": "Q1",
      "sales": 588,
      "income": 1473,
      "expenses": 1938
    },
    {
      "month": "Apr",
      "q": "Q2",
      "sales": 1793,
      "income": 259,
      "expenses": 1678
    },
    {
      "month": "May",
      "q": "Q2",
      "sales": 1407,
      "income": 671,
      "expenses": 2071
    },
    {
      "month": "Jun",
      "q": "Q2",
      "sales": 1540,
      "income": 728,
      "expenses": 2104
    },
    {
      "month": "Jul",
      "q": "Q3",
      "sales": 1800,
      "income": 1797,
      "expenses": 609
    },
    {
      "month": "Aug",
      "q": "Q3",
      "sales": 1597,
      "income": 1123,
      "expenses": 1043
    },
    {
      "month": "Sep",
      "q": "Q3",
      "sales": 1847,
      "income": 1670,
      "expenses": 359
    },
    {
      "month": "Oct",
      "q": "Q4",
      "sales": 705,
      "income": 1034,
      "expenses": 439
    },
    {
      "month": "Nov",
      "q": "Q4",
      "sales": 1696,
      "income": 1775,
      "expenses": 1194
    },
    {
      "month": "Dec",
      "q": "Q4",
      "sales": 1151,
      "income": 480,
      "expenses": 748
    }
  ];
  colorTheme = [
    {
      field: 'income',
      type: 'pattern',
      patternType: 1,
      start: '#EDE342',
      stop: '#5CB270',
      color:'#89FC00'
    },
    {
      field: 'sales',
      type: 'pattern',
      patternType: 2,
      start: '#f72585',
      stop: '#7400b8',
      color: '#DC0073',
    },
    {
      field: 'expenses',
      type: 'pattern',
      patternType: 3,
      start: '#9b2226',
      stop: '#001219',
      color: '#04E762',
    },
  ];
  // [{ field:'income',name: 'Income'},
  // { field:'sales',name: 'Sales'},
  // {field:'expenses',name: 'Expenses' }]
  chartAxis = [
    {
      type: 'gauge',
      xaxis: [
        { 'field': 'month', name: 'Month' }
      ],
      yaxis: [
        { field: 'income', name: 'Income' },
        { field: 'sales', name: 'Sales' },
        // { field: 'expenses', name: 'Expenses' }
      ],
      name: 'Montly Income vs Sales vs Expenses',
      size: {
        height: '500px',
        width: '500px'
      },
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },

      config: {
        // min: 0,
        // max: 100000,
        units: '',
        width: 50,
        fullCircle: true,
        startingAngle: 360,
        needle: {
          show: true,
          color: '#ffff00',
          value:10000
        }
      }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    },
    //   {
    //     "type": "donut",
    //     "xaxis": [
    //         {
    //             "name": "Sales stage",
    //             "type": "string",
    //             "field": "col5",
    //             "dataType": "string",
    //             "alias": {
    //                 "~m~count": "col5"
    //             },
    //             "options": {
    //                 "type": null,
    //                 "link": {
    //                     "report": null,
    //                     "field": null
    //                 },
    //                 "decimal_places": 0,
    //                 "aggregate": {
    //                     "id": 2,
    //                     "name": "count"
    //                 },
    //                 "calculationFormulas": [
    //                     {
    //                         "name": null,
    //                         "parameters": []
    //                     }
    //                 ],
    //                 "representation": "",
    //                 "time_grain": null,
    //                 "decimal_palces": "",
    //                 "currency": "INR",
    //                 "append_text_right": "",
    //                 "append_text_left": "",
    //                 "decimal_symbol": "",
    //                 "group_symbol": "",
    //                 "filterUIType": null,
    //                 "style": {
    //                     "gradient": false,
    //                     "gradientType": "linear",
    //                     "endColor": "#FF9B85",
    //                     "degree": 0,
    //                     "color": "#FF9B85",
    //                     "fontStyle": "",
    //                     "bold": false,
    //                     "underline": false,
    //                     "italic": false,
    //                     "h_align": "center",
    //                     "size": 15,
    //                     "bg_color": "#ffffff"
    //                 },
    //                 "conversion": {
    //                     "type": null,
    //                     "from": null,
    //                     "to": null
    //                 }
    //             },
    //             "width": "",
    //             "sortable": true,
    //             "sort": 0,
    //             "show": true,
    //             "styleClass": "",
    //             "conditionClass": "",
    //             "filter": false,
    //             "filterRequired": false,
    //             "filterUIType": null,
    //             "filterDateRanges": [],
    //             "filterLabel": "",
    //             "filterId": "",
    //             "editable": false,
    //             "prop": "col5"
    //         }
    //     ],
    //     "yaxis": [],
    //     "name": "",
    //     "xaxislabel": {
    //         "text": "X-axis",
    //         "position": "outer-center"
    //     },
    //     "yaxislabel": {
    //         "text": "Y-axis",
    //         "position": "outer-middle"
    //     },
    //     "xlambda": {
    //         "prefix": "",
    //         "suffix": "",
    //         "operator": "",
    //         "operand": ""
    //     },
    //     "ylambda": {
    //         "prefix": "",
    //         "suffix": "",
    //         "operator": null,
    //         "operand": ""
    //     },
    //     "rotated": false,
    //     "xtickrotate": 0,
    //     "config": {
    //         "min": 0,
    //         "max": 100000,
    //         "units": "",
    //         "width": 50,
    //         "fullCircle": false,
    //         "label": {
    //             "show": true
    //         }
    //     }
    // },

    {
      type: 'treemap',
      xaxis: [{ field: 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },{ field: 'month', name: 'Month' }, { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Incomesss vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      config: {
        label: {
          show: true,
          // format: function (value, ratio, id) {

          // },
          threshold: 0.1
        },
        expand: true,// Expand on mouse hover
        padAngle: .0, //Gap between the slices
        title: 'TEST Title1', // Text inside donut
        width: 50 // radius of eacch slice
      }
    },
    {
      type: 'donut',
      xaxis: [{ field: 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' }, { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Incomesss vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      config: {
        label: {
          show: true,
          // format: function (value, ratio, id) {

          // },
          threshold: 0.1
        },
        expand: true,// Expand on mouse hover
        padAngle: .0, //Gap between the slices
        title: 'TEST Title1', // Text inside donut
        width: 50 // radius of eacch slice
      }
    },

    {
      type: 'area',
      xaxis: [{ field: 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-left' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      ytickformat: { representation: 'currency', type: '$~s', prefix: '', suffix: '',localization:'ar-AE' }
      // rotated: true,
      // groups: [
      //   ['income', 'sales', 'expenses']
      // ]
    },
    {
      type: 'polar',
      xaxis: [{ field: 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-left' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      // rotated: true,
      // groups: [
      //   ['income', 'sales', 'expenses']
      // ]
    },
    {
      type: 'pie',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,

    {
      type: 'bar',
      xaxis: [{ field: 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      xtickformat: function (x) { return x + 'Q' },
      ytickformat: function (y) { return 'pre' + (y / 1000) + 'k' },
      // rotated: true
    },
    // [
    // {
    //   type: 'radialBar',
    //   xaxis: [{ field: 'month', name: 'Month' }],
    //   yaxis: [{ field: 'income', name: 'Income' },
    //   { field: 'sales', name: 'Sales' },
    //   { field: 'expenses', name: 'Expenses' }],
    //   name: 'Montly Income vs Sales vs Expenses',
    //   xaxislabel: { text: 'Months', position: 'outer-left' },
    //   yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
    //   rotated: true,
    //   groups: [
    //     ['income', 'sales', 'expenses']
    //   ]
    // },

    // // [

    {
      type: 'donut',
      xaxis: [{ field: 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' }, { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      config: {
        label: {
          show: true,
          // format: function (value, ratio, id) {

          // },
          threshold: 0.1
        },
        expand: true,// Expand on mouse hover
        padAngle: .0, //Gap between the slices
        title: 'TEST Title1', // Text inside donut
        width: 50 // radius of eacch slice
      }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,

    {
      type: 'bar',
      xaxis: [{ field: 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      rotated: true,
      groups: [
        ['income', 'sales', 'expenses']
      ]
    },

    {
      type: 'bar',
      xaxis: [{ field: 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50,
      // axis: {
      // rotated: true
      // }
    },

    // [
    {
      type: 'line',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,
    // [
    {
      type: 'spline',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      xshow: false,
      yshow: false,
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,
    // [
    {
      type: 'step',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,
    // [
    {
      type: 'area-spline',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses Axis',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },

      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,
    // [
    {
      type: 'area-step',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,
    // [
    {
      type: 'scatter',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,
    // // [
    {
      type: 'gauge',
      xaxis: [
        { 'field': 'month', name: 'Month' }
      ],
      yaxis: [
        { field: 'income', name: 'Income' },
        { field: 'sales', name: 'Sales' },
        // { field: 'expenses', name: 'Expenses' }
      ],
      name: 'Montly Income vs Sales vs Expenses',
      size: {
        height: '500px',
        width: '500px'
      },
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
      config: {
        // min: 0,
        // max: 100000,
        units: '',
        width: 15,
        cornerRadius:0.3,
        needle: {
          show: true,
          color: '#ffff00',
          value:10000
        }


      }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    },
    {
      type: 'gauge',
      xaxis: [
        { 'field': 'month', name: 'Month' }
      ],
      yaxis: [
        { field: 'income', name: 'Income' },
        { field: 'sales', name: 'Sales' },
        // { field: 'expenses', name: 'Expenses' }
      ],
      name: 'Montly Income vs Sales vs Expenses',
      size: {
        height: '500px',
        width: '500px'
      },
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' },

      config: {
        // min: 0,
        // max: 100000,
        units: '',
        width: 50,
        fullCircle: true,
        startingAngle: 360,
      }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,
    // // [
    {
      type: 'area',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    ,
    // // [

    // [
    {
      type: 'radar',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    // , {
    //   type: 'area-spline-range',
    //   xaxis: [{ 'field': 'month', name: 'Month' }],
    //   yaxis: [{ field: 'income', name: 'Income' },
    //   { field: 'sales', name: 'Sales' },
    //   { field: 'expenses', name: 'Expenses' }],
    //   name: 'Montly Income vs Sales vs Expenses',
    //   xaxislabel: { text: 'Months', position: 'outer-center' },
    //   yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
    //   // innerRadius: 30,
    //   // radius: 100,
    //   // explode: true,
    //   // explodeOffset: 50

    // }
    , {
      type: 'candlestick',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    // , {
    //   type: 'polar-area',
    //   xaxis: [{ 'field': 'month', name: 'Month' }],
    //   yaxis: [{ field: 'income', name: 'Income' },
    //   { field: 'sales', name: 'Sales' },
    //   { field: 'expenses', name: 'Expenses' }],
    //   name: 'Montly Income vs Sales vs Expenses',
    //   xaxislabel: { text: 'Months', position: 'outer-center' },
    //   yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
    //   // innerRadius: 30,
    //   // radius: 100,
    //   // explode: true,
    //   // explodeOffset: 50

    // }
    , {
      type: 'bubble',
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    , {
      type: { 'income': 'bar', 'sales': 'line', 'expenses': 'spline' },
      xaxis: [{ 'field': 'month', name: 'Month' }],
      yaxis: [{ field: 'income', name: 'Income' },
      { field: 'sales', name: 'Sales' },
      { field: 'expenses', name: 'Expenses' }],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    , {
      type: { 'income': 'bar', 'sales': 'line', 'expenses': 'spline' },
      xaxis: [],
      yaxis: [],
      name: 'Montly Income vs Sales vs Expenses',
      xaxislabel: { text: 'Months', position: 'outer-center' },
      yaxislabel: { text: 'Money Flow', position: 'outer-middle' }
      // innerRadius: 30,
      // radius: 100,
      // explode: true,
      // explodeOffset: 50

    }
    // { type: 'pie', xaxis: 'month', yaxis: 'income', name: 'Income', animation: true, radius: 100 },
    // { type: 'bar', xaxis: 'month', yaxis: 'expenses', name: 'Expenses', marker: true, animation: true },
    // { type: 'line', xaxis: 'month', yaxis: 'expenses', name: 'Expenses', marker: true, animation: true }
    // { type: 'line', xaxis: 'month', yaxis: 'income', name: 'Income', animation: true },
    // ]
  ]
    ;
  constructor() {
    // Object.assign(this, { this.data });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  toogleData() {
    // this.chartAxis=[...this.chartAxis];
    // this.chartAxis1 = {
    //   type: 'line',
    //   xaxis: [{ 'field': 'month', name: 'Month' }],
    //   yaxis: [{ field: 'income', name: 'Income' },
    //   { field: 'sales', name: 'Sales' },
    //   { field: 'expenses', name: 'Expenses' }],
    //   name: 'Montly Income vs Sales vs Expenses',
    //   xaxislabel: { text: 'Months', position: 'outer-center' },
    //   yaxislabel: { text: 'Money Flow', position: 'outer-middle' },
    //   // innerRadius: 30,
    //   // radius: 100,
    //   // explode: true,
    //   // explodeOffset: 50
    //   rotated: false
    // };
    this.data = [



      {
        "month": "Feb",
        "sales": 1313,
        "income": 967,
        "expenses": 1007
      },
      {
        "month": "Jun",
        "sales": 1540,
        "income": 728,
        "expenses": 2104
      },
      {
        "month": "Jul",
        "sales": 1800,
        "income": 1797,
        "expenses": 609
      },
      {
        "month": "Oct",
        "sales": 705,
        "income": 1034,
        "expenses": 439
      },
      {
        "month": "Nov",
        "sales": 1696,
        "income": 1775,
        "expenses": 1194
      },
      {
        "month": "Dec",
        "sales": 1151,
        "income": 480,
        "expenses": 748
      }
    ];
  }
  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


}
