import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { localization } from '../../assets/localization'
import bb, {
  donut, bar, spline, line, gauge, area, pie, areaSpline, step, areaStep, scatter,
  radar, candlestick, bubble, areaLineRange, areaSplineRange, treemap
} from "billboard.js";
import * as bb2 from "billboard.js";

import * as d3 from 'd3';
@Component({
  selector: 'datalytics-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

})
export class ChartsComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  _data: any;

  public chartType: string = '';
  public primaryXAxis: Object;
  public chartData: Object[];
  public title: string;
  public primaryYAxis: Object;
  public marker: Object;
  _palette: any[];
  chart: any;
  public error: { status: boolean, messages: any[] } = { status: false, messages: [] };
  @Input() set data(data) {
    this.chartData = data;
  }

  public chartTypeParser = {
    bar: { name: 'bar', type: 1 },
    line: { name: 'line', type: 1 },
    spline: { name: 'spline', type: 1 },
    area: { name: 'area', type: 1 },
    step: { name: 'Step', type: 1 },
    areaSpline: { name: 'area-spline', type: 1 },
    areaStep: { name: 'area-step', type: 1 },
    scatter: { name: 'scatter', type: 1 },
    pie: { name: 'Pie', type: 2 },
    donut: { name: 'donut', type: 3 },
    gauge: { name: 'gauge', type: 3 },
    treemap: { name: 'treemap', type: 3 }
  };
  @Input() id: string = 'datalytics_cts_' + Math.floor(Math.random() * 10000000) + 1;
  @Input() chartAxis: any;
  _chartOptions: any = { legend: {}, refresh: false, export: [] };

  @Input() showDataTable = false;
  @Input() chartOptions: {
    focus: any;
    legend: boolean | {},
    animation: boolean | {},
    height: number | string,
    width: number | string,
    legendPosition?: [],
    title: string,
    tooltip: string,
    xaxis: string,
    labels?: boolean | {},
    gridX?: boolean,
    gridY?: boolean
  } = {
      legend: { visible: true },
      animation: true,
      height: 400,
      width: 400,
      title: '',
      tooltip: '',
      xaxis: '',
      labels: true,
      gridX: true,
      gridY: true,
      focus: false
    };
  configuration: any = {};


  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.data && changes.data.firstChange == false) ||
      changes.chartAxis !== undefined && changes.chartAxis.firstChange == false ||
      changes.chartOptions && changes.chartOptions.firstChange == false ||
      changes.currentColorTheme && changes.currentColorTheme.firstChange == false
    ) {
      // if (changes.chartAxis !== undefined) {
      // if (changes.chartAxis.currentValue.xaxis.length > 0 && changes.chartAxis.currentValue.yaxis.length > 0) {
      this.refreshChart();

      // } else {
      //   this.error.status = true;
      //   this.error.messages.push('Please select atleast one x-axis and one y-axis');
      //   this.cd.detectChanges();
      // }
      // }
    }
  }
  formatData(data: any): Object[] {
    let chartType = this.getChartType(this.chartAxis.type);
    if (this.chartAxis.yaxis.length == 0) {
      this.error.status = true;
      this.error.messages.push('Please select atleast one y-axis');
      this.cd.detectChanges();
    }
    if (this.chartAxis.xaxis.length == 0) {
      this.error.status = true;
      this.error.messages.push('Please select atleast one x-axis');
      this.cd.detectChanges();
    }
    if (chartType == 'pie' || chartType == 'donut') {
      let tempData = {};

      data.forEach(row => {

        this.chartAxis.xaxis.forEach(xdata => {
          tempData[row[xdata.field]] = [];
          tempData[row[xdata.field]].push(row[xdata.field] != null ? row[xdata.field] : 'null');
          this.chartAxis.yaxis.forEach(ydata => {

            tempData[row[xdata.field]].push(parseFloat(row[ydata.field] != null ? row[ydata.field] : 0))
          });
        })
      });
      data = Object.values(tempData);

    }
    return data;
  }
  makeRepresentation(numberData: number) {
  }
  refreshChart() {
    if (typeof this.chart == 'object')
      this.chart.unload();
    this.getColorTheme();
    let configuration = {
      labels: this.chartOptions.labels,
      json: this.formatData(this.chartData),
      names: this.getDisplayNames(this.chartAxis.yaxis),
      keys: {
        x: this.getColumnNames(this.chartAxis.xaxis)[0],//Only if type category
        value: this.getColumnNames(this.chartAxis.yaxis)
      },
      size: {
        height: this.chartOptions.height ? this.chartOptions.height : '400px',
        width: this.chartOptions.width ? this.chartOptions.width : '100%'
      },
      type: this.getChartType(this.chartAxis.type),
      legend: {
        show: this.chartOptions.legend ? this.chartOptions.legend : true
      },
      axis: {
        x: {
          // x:['month'],
          label: this.getChartAxisLabel(this.chartAxis.xaxislabel),
          type: 'category', //Type:timeseries,category,indexed
          // localtime:true If true, treat x value as localtime. If false, convert to UTC internally.
          show: this.chartAxis.xshow == false ? this.chartAxis.xshow : true,
          tick: { format: this.chartAxis.xtickformat ? this.chartAxis.xtickformat : function (x) { return x } },
        },
        y: {
          label: this.getChartAxisLabel(this.chartAxis.yaxislabel),
          show: this.chartAxis.xshow == false ? this.chartAxis.xshow : true,
          tick: {
            format: this.chartAxis.ytickformat ? (y) => {
              if (this.chartAxis.ytickformat.representation != '') {

                return d3.format(this.chartAxis.ytickformat.representation.type)(y)
              } else {
                return y;
              }
            } : function (y) {
              return y
            }
          },
        }
      },

    };
    configuration['color'] = this.configuration['color'];
    if (this.error.status == false) {
      this.chart.load(configuration);
    }

  }

  public tooltip: Object = {
    enable: true,
    shared: true,
    header: "<b>${point.x}</b>",
    format: " : <b>${point.y}</b>"
  };
  public animation: Object = { enable: true };
  chartSeriesType = -1;
  constructor(private cd: ChangeDetectorRef) { }
  colorPatterns = {
    theme1: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
    theme2: ['#67b7dc', '#6771dc', '#a367dc'],
    theme3: ['#00bdae', '#000', '#357cd2', '#e56590', '#fed8ab'],
    theme4: ['#161d6d', '#21bbaf', '#5950b9', '#ff6d34', '#fed8ab'],
  }
  // @Input() currentColorTheme: string | string[] = ['#041562','#DA1212'];
  @Input() currentColorTheme: string | string[] | { type: string, degree: number, start: string, stop: string, field: string }[] =
    ['#00d4ef', '#2196f3', '#3f51b5', '#e91e63', '#ff9800'];
  @Input() colorThresolds: number[] | null = null;
  // @Input() currentColorTheme: string | string[] = ['#20c2ef','#fcd433','#ee3738','#98ca3a','#f7941d'];

  getColorTheme() {
    let colorsPatterns = [];
    if (Array.isArray(this.currentColorTheme)) {
      if (typeof this.currentColorTheme[0] == 'object') {
        // Gradient
        let gradients = '';
        // if (this.chartType == 'pie' || this.chartType == 'donut') {
        this.configuration['color'] = { pattern: [] };
        // } else {
        // this.configuration['data']['colors'] = {};
        // }
        function getGradient(start, end, index) {
          var gradient = d3.select(document.createElementNS(d3.namespaces.svg, "linearGradient"))
            .attr("patternUnits", "userSpaceOnUse")
            .attr("x" + index, "5%")
            .attr("y" + index, "95%");

          gradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", start);

          gradient
            .append("stop")
            .attr("offset", "95%")
            .attr("stop-color", end);

          return gradient.node();
        }
        function getPattern(patternType: number = 1, color = '#ffffff') {
          var pattern = d3.select(document.createElementNS(d3.namespaces.svg, "pattern"))
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", "6")
            .attr("height", "6");

          var g = pattern
            .append("g")
            .attr("fill-rule", "nonzero")
            // .attr("stroke-width", 0)
            .append("g")
            .attr("fill", '#fff');
          //stripped
          if (patternType == 1) {
            g.append("polygon").attr("points", "5 0 6 0 0 6 0 5");
            g.append("polygon").attr("points", "6 5 6 6 5 6");
          }
          //dashed
          if (patternType == 2) {
            g.append("polygon").attr("points", "5 0 6 0 0 6 0 5");
            // g.append("polygon").attr("points", "6 5 6 6 5 6");
          }
          //dotted 
          if (patternType == 3) {
            g.append("polygon").attr("points", "5 5 10 5 5 10");
          }


          if (patternType == 4) {
            // g.append("polygon").attr("points", "5 0 6 0 0 6 0 5");
            // g.append("polygon").attr("points", "31.4 83.8 10.5 83.3 21.6 52.4");
          }

          return pattern.node();
        }
        let tiles = [];
        let colors = [];
        this.currentColorTheme.forEach((colorgradient, index) => {
          // getGradient(colorgradient.start, colorgradient.end, index),

          if (colorgradient.type == 'linear') {

            tiles.push(getGradient(colorgradient.start, colorgradient.end, index));
            // colors.push(colorgradient.start);
          }
          if (colorgradient.type == 'pattern') {
            let color = colorgradient?.color ? colorgradient?.color : '#fff';
            tiles.push(getPattern(colorgradient.patternType, color));
            colors.push(color);
          }
        });

        this.configuration['color']['pattern'] = colors;
        this.configuration['color']['tiles'] = function () {
          return tiles;
        }

      } else {
        this.configuration['color'] = {
          pattern: this.currentColorTheme
        }
      }

    }
    else {
      this.configuration['color'] = {
        pattern: this.colorPatterns[this.currentColorTheme]
      };
    }
    // console.log('Testing...',colorsPatterns);
    return colorsPatterns;
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    // const observer = new ResizeObserver(entries => {
    //   const width = entries[0].contentRect.width;
    // });

    if (this.chartAxis.xaxis.length > 0 && this.chartAxis.yaxis.length > 0) {
      let type: any = '';
      let types = [];
      if (typeof this.chartAxis.type == 'object') {
        types = Object.keys(this.chartAxis.type);
        type = this.getChartType(this.chartAxis.type[types[0]]);
        types.shift();
      } else {
        type = this.getChartType(this.chartAxis.type);
      }
      // let type = this.getChartType(this.chartAxis.type);
      let config = typeof this.chartAxis.config != 'undefined' ? this.chartAxis.config : {};
      let typeconfig = this.getChartTypeConfigurations(type, config);
      this.chartType = this.chartAxis.type;
      this.configuration = {
        bindto: '#datalytics_' + this.id + '_chart_container',
        // boost: { useWorker: true },
        transition: {
          duration: 500
        },
        data: {
          labels: this.chartOptions.labels,
          // type: type, // line,spline,step,area,area-spline,area-step,bar,scatter,pie,donut,gauge,
          type: type,

          names: this.getDisplayNames(this.chartAxis.yaxis),
        },
        size: {
          height: this.chartOptions.height,
          width: this.chartOptions.width
        },
        legend: {
          show: this.chartOptions.legend,
        },

        tooltip: this.getTooltipDetails(),
        axis: {
          x: {
            // x:['month'],
            label: this.getChartAxisLabel(this.chartAxis.xaxislabel),
            type: 'category', //Type:timeseries,category,indexed
            tick: {
              rotate: this.chartAxis.xtickrotate ? this.chartAxis.xtickrotate : 0,
              multiline: this.chartAxis.xmultiline ? this.chartAxis.xmultiline : false,
              // format: this.chartAxis.xtickformat ? this.chartAxis.xtickformat : function (x) { return x },
            },

            // localtime:true If true, treat x value as localtime. If false, convert to UTC internally.
            show: this.chartAxis.xshow == false ? this.chartAxis.xshow : true,
          },
          y: {
            label: this.getChartAxisLabel(this.chartAxis.yaxislabel),
            tick: {
              rotate: this.chartAxis.ytickrotate ? this.chartAxis.ytickrotate : 0,
              multiline: this.chartAxis.ymultiline ? this.chartAxis.ymultiline : false,
              format: this.chartAxis.ytickformat ? (y) => {
                // d3.formatDefaultLocale(localization[defaultLocalization]);
                if (this.chartAxis.ytickformat.representation != '') {
                  return (this.chartAxis.ytickformat?.prefix ? this.chartAxis.ytickformat?.prefix : '') + d3.format(this.chartAxis.ytickformat?.type)(y) + (this.chartAxis.ytickformat?.suffix ? this.chartAxis.ytickformat?.suffix : '');
                } else {
                  return y;
                }
              } : function (y) {
                return y
              },
            },
            show: this.chartAxis.xshow == false ? this.chartAxis.xshow : true,
          },

          rotated: this.chartAxis.rotated ? this.chartAxis.rotated : false,

        },
        // names: this.getDisplayNames(this.chartAxis.yaxis),
        grid: {
          focus: {
            show: this.chartOptions.focus,
            y: this.chartOptions.gridY,
            edge: this.chartOptions.gridX
          },
          x: {
            show: this.chartOptions.gridX
          },
          y: {
            show: this.chartOptions.gridY
          }
        },

      };

      if (typeof this.chartAxis.type == 'object') {
        this.configuration['data']['types'] = {};
        types.forEach(charttype => {
          this.configuration['data']['types'][charttype] = this.getChartType(this.chartAxis.type[charttype]);
        });
      }
      if (this.chartAxis.type == 'gauge') {
        this.configuration['arc'] = {
          cornerRadius: {
            ratio: this.chartAxis.config?.cornerRadius ? this.chartAxis.config?.cornerRadius : 0.14
          },
          needle: {
            show: this.chartAxis.config?.needle?.show ? this.chartAxis.config?.needle?.show : false,
            value: 0,
            color: this.chartAxis.config?.needle?.color ? this.chartAxis.config?.needle?.color : ''
          }
        };
      }
      if (this.chartAxis.type == 'pie' || this.chartAxis.type == 'donut') {
        this.configuration['data']['columns'] = this.formatData(this.chartData);
      } else {
        if (this.chartAxis.groups?.length > 0) {
          this.configuration['data']['groups'] = this.chartAxis.groups;
        }
        // if (this.chartAxis.type == 'line' || this.chartAxis.type == 'spline' || this.chartAxis.type == 'area' || this.chartAxis.type == 'area-spline' 
        // || this.chartAxis.type == 'area-step' || this.chartAxis.type == 'bubble') {
        //   this.configuration['point'] = {
        //     r: 4,
        //     // focus: {
        //     //   expand: {
        //     //     r: 5 * 2
        //     //   }
        //     // },
        //     // select: {
        //     //   r: 6
        //     // }
        //   };
        // }

        this.configuration['data']['json'] = this.formatData(this.chartData);
        // this.configuration['data']['names'] = this.chartAxis.yaxis;
        this.configuration['data']['keys'] = {
          x: this.getColumnNames(this.chartAxis.xaxis)[0],//Only if type category
          value: this.getColumnNames(this.chartAxis.yaxis)
        };
      }

      this.configuration['oninit'] = function () {
        let dx = 3;
        let dy = 3;
        let deviation = 2;
        if (type == 'donut') {
          // d3.select('svg').selectAll('g.circles').attr('transform', 'translate(0,0)');
          dx = 1;
          dy = 1;
          deviation = 1;
        }
        if (type == 'line' || type == 'spline') {
          dx = 0.5;
          dy = 0.5;
          deviation = 0.5;
        }
        if (type == 'bar') {
          dx = 5;
          dy = 5;
          deviation = 5;
        }
        if (type == 'bubble' || type == 'scatter' || type == 'radar') {
          dx = 15;
          dy = 15;
          deviation = 15;
        }
        d3.select('svg').append('filter').attr('id', 'shadow')
          // .attr('color-interpolation-filters', 'sRGB')
          .append('feDropShadow')
          .attr('dx', dx)
          .attr('dy', dy)
          .attr('stdDeviation', deviation)
          .attr('flood-opacity', 0.7)
          .attr('flood-color', 'grey')
        // );

        // d3.select('svg').select('defs')['_groups'][0][0].innerHTML += '<filter id=\'shadow\' color-interpolation-filters="sRGB">    <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.5"/>  </filter>';
      };
      this.configuration[type] = typeconfig;
      this.getColorTheme();
      this.chart = bb.generate(this.configuration);
      if (type == 'gauge' && this.chartAxis.config?.needle?.value > 0) {
        // this.chart.$.needle.updateHelper(this.chartAxis.config?.needle?.value, true)
        setTimeout(()=>{this.chart.$.needle.updateHelper(this.chartAxis.config?.needle?.value, true);}, 1000);
      }
      this.configuration = {};
    } else {
      console.log('Chart data is empty');
      this.error.status = true;
      this.error.messages.push('Please select atleast one x-axis and one y-axis');
      this.cd.detectChanges();


    }
  }
  getChartTypeConfigurations(type: any, properties: any = {}) {
    if (type == 'donut') {
      let donut = {
        label: {
          show: true,
          // 'format': function (value, ratio, id) {
          //   return d3.format('$')(value);
          // },
          threshold: 0.1
        },
        expand: true,// Expand on mouse hover
        padAngle: .1, //Gap between the slices
        title: '', // Text inside donut
        width: 50 // radius of eacch slice
      };
      // properties.label.format = properties.label.format ? properties.label.format : function (value, ratio, id) {
      //   return (ratio * 100).toFixed(1) + '% <br/>(' + value + ')';
      // };

      return Object.assign(donut, properties);
    }
    if (type == 'line') {
      let line = {
        connectNull: false, // Whether to connect null values in the line
        step: {
          type: 'step-after'
        }
      }
      return Object.assign(line, properties);
    }
    if (type == 'pie') {
      let pie = {
        label: {
          show: true,
          // format: function (value, ratio, id) {

          // },
          threshold: 0.1
        },
        expand: true,// Expand on mouse hover
        // padAngle: .1, //Gap between the slices
      };
      return Object.assign(pie, properties);
    }
    if (type == 'bar') {
      let bar = {
        width: {
          ratio: 0.9 // This makes bar width 50% of length between ticks
        },
        space: 0.1, // The spacing between bars
        zerobased: false
      }

      return Object.assign(bar, properties);
    }
    if (type == 'gauge') {
      let gauge = {
        label: {
          show: true,
          // format: function (value, ratio, id) {

          // },
        },
        // arc: {
        //   cornerRadius: {
        //     ratio: 0.5
        //   }
        // },
        // gauge: {
        type: "multi",
        arcLength: 95,
        fullCircle: true,
        startingAngle: -3,
        // width: 50,
        // },
        expand: true,// Expand on mouse hover
        // min: 0, //Gap between the slices
        // startingAngle: 90,
        // fullCircle: true,
        max: 100,
        arcs: {
          minWidth: 5
        },
        //Gap between the slices
        units: '%', //Gap between the slices
        width: 100, //Gap between the slices
      };
      return Object.assign(gauge, properties);

    }
    if (type == 'spline') {
      let spline = {
        interpolation: { type: 'spline' }
      };
      return Object.assign(spline, properties);
    }
    if (type == 'treemap') {
      let treemap = {
        tile: 'dice', //Slice,DICE,Binary
        label: { threshold: 0.3 }
      };
      return Object.assign(treemap, properties);
    }

  }
  getChartAxisLabel(axisLabel: { text?: string, position?: string } = {}) {
    // let formattedAxisLabel = {text:'',position:'outer-middle'};
    axisLabel.text = axisLabel.text ? axisLabel.text : '';
    axisLabel.position = axisLabel.position ? axisLabel.position : 'outer-middle';
    return axisLabel;
  }
  getDisplayNames(columnNames: any) {
    // let columnsObj = Object.keys(columnNames);

    if (columnNames.length > 0) {
      let result = {};
      columnNames.forEach((colName, index) => {
        result[colName.field] = colName.name ? colName.name : colName.field;
      });

      return result;
    } else {
      return {};
    }
  }
  getColumnNames(columnNames: any[]) {
    let names: any[] = [];
    if (Array.isArray(columnNames)) {
      columnNames.forEach((col, index) => {
        // console.log(col);
        // d3.formatDefaultLocale(col.localization);    
        names.push(col.field);
      });
    }
    return names;
  }
  ngOnInit(): void {

    // this.getChartSeriesType();
    this._palette = ['#00bdae', '#357cd2', '#e56590'];
    if (typeof this.chartOptions['localization'] == 'object') {
      d3.formatDefaultLocale(this.chartOptions['localization']);
    } else {
      let defaultLocalization = this.chartOptions['localization'] ? this.chartOptions['localization'] : 'en-US';
      d3.formatDefaultLocale(localization[defaultLocalization]);
    }
    this.primaryXAxis = {
      title: this._chartOptions.xaxis,
      labelIntersectAction: 'Rotate45',
      valueType: 'Category'
    };
    // this.primaryYAxis = {
    //   title: 'Growth',
    //   minimum: -3, maximum: 3, interval: 1
    // };
    this.marker = { visible: true, height: 10, width: 10, opacity: 1 };

    this.getChartDataSet();
  }
  getChartSeriesType(charttype: string = 'line') {

    const type = this.chartTypeParser[charttype].type;
    this.chartSeriesType = type === this.chartSeriesType || this.chartSeriesType === -1 ? type : 0;
  }
  getChartType(chartType: string) {
    // import {this.chartTypeParser[chartType].name} from 'billboard.js';
    switch (chartType) {
      case 'bar':
        return bar();
      case 'line':
        return line();
      case 'spline':
        return spline();
      case 'pie':
        return pie();
      case 'donut':
        return donut();
      case 'gauge':
        return gauge();
      case 'area':
        return area();
      case 'area-spline':
        return areaSpline();
      case 'step':
        return step();
      case 'area-step':
        return areaStep();
      case 'scatter':
        return scatter();
      case 'pie':
        return pie();
      case 'radar':
        return radar();
      // case 'radial-area':
      //   return radialArea();
      case 'area-line-range':
        return areaLineRange();
      case 'area-spline-range':
        return areaSplineRange();
      case 'candlestick':
        return candlestick();
      case 'polar':
        // return polarArea();
        return bar();
      case 'polar-area':
        // return polarArea();
        return bar();
      case 'bubble':
        return bubble();
      case 'treemap':
        return treemap();
      default:
        return bar();
    }
    // return this.chartTypeParser[chartType].name();
  }
  getMarkerDetails(showmarker: boolean = false) {
    return { visible: showmarker, height: 10, width: 10, opacity: 1 };
  }
  getAnimationDetails(showmanimation: boolean = false) {
    return { enable: showmanimation, duration: 300, delay: 10 };
  }
  getDataLabelDetails(labelname: string, showlabel: boolean = true, position: string = 'Inside') {
    return {
      visible: showlabel,
      position: position, name: labelname, font: {
        fontWeight: '600'
      }
    }
  }
  getTooltipDetails() {
    let tooltipConfig = this._chartOptions.tooltip !== undefined ? this._chartOptions.tooltip : {};
    tooltipConfig.show = tooltipConfig.show ? tooltipConfig.show : true;
    tooltipConfig.grouped = tooltipConfig.grouped ? tooltipConfig.grouped : true;
    // tooltipConfig.format = tooltipConfig.format ? tooltipConfig.format : '${point.x} : <b>${point.y}%</b>';
    tooltipConfig.horizontal = tooltipConfig.horizontal ? tooltipConfig.horizontal : false;
    if (['pie', 'donut'].includes(this.chartType)) {
      tooltipConfig.format = {
        value: function (value, ratio, id) {
          return (ratio * 100).toFixed(1) + '% (' + value + ')';
        }


      };
    }
    //   let tooltip = '';
    //   let tooltipColor = tooltipConfig.grouped == true ? '#c4c7d0' : color(d[0].id);

    //   tooltip += '<div class="d-chart-tooltip">';
    //   tooltip += '<div class="arrow">';
    //   tooltip += '</div>';
    //   tooltip += '<div class="content" style="background-color:' + tooltipColor + '">';
    //   if (tooltipConfig.grouped == false) {
    //     tooltip += '<div class="title">';
    //     tooltip += d[0].name;
    //     tooltip += '</div>';
    //   } else {
    //     tooltip += '<table>';
    //   }
    //   let type = this.getChartType(this.chartAxis.type).toLowerCase();
    //   d.forEach((data) => {

    //     if (tooltipConfig.grouped == false) {
    //       tooltip += '<div class="value">' + defaultValueFormat(data.value) + '</div>';
    //     } else {
    //       if (type == 'pie' || type == 'donut') {
    //         tooltip += '<div class="value" style="background-color:' + color(data.id) + '">' + data.value + ' ( ' + (data.ratio * 100).toFixed(1) + '%) </div>';
    //       } else {
    //         tooltip += '<tr class="multi-values"><td class="color" style="background-color:' + color(data.id) + '">&nbsp;</td>&nbsp;<td class="title">' + data.name + '</td><td class="value">' + defaultValueFormat(data.value) + '</td></tr>';
    //       }
    //     }
    //   });
    //   if (tooltipConfig.grouped == true) {
    //     tooltip += '</table>';
    //   }
    //   tooltip += '</div>';
    //   tooltip += '</div>';
    //   return tooltip;
    // };
    return tooltipConfig;

    // show: boolean = true, format: string = ''


    // format = show == true && format == '' ? '${point.x} : <b>${point.y}%</b>' : '';
    // return {
    //   enable: true, format: format
    // };
  }
  getStartAngle(start: number) {
    return start == undefined ? 0 : start;
  }
  getEndAngle(end: number) {
    return end == undefined ? 0 : end;
  }
  getChartDataSet() {
    // let data = [];
    // this.data.forEach((element) => {
    //   data.push(element[this.columns[0]]);

    // });
    // this.data[0].data = data;
  }
}

