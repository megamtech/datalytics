import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: any = [
    {
      "month": "Apr",
      "income": 0,
      "expense": 0
    },
    {
      "month": "May",
      "income": 10000,
      "expense": 0
    },
    {
      "month": "Jun",
      "income": 0,
      "expense": 0
    },
    {
      "month": "Jul",
      "income": 0,
      "expense": 0
    },
    {
      "month": "Aug",
      "income": 0,
      "expense": 0
    },
    {
      "month": "Sep",
      "income": 0,
      "expense": 0
    },
    {
      "month": "Oct",
      "income": 0,
      "expense": 0
    },
    {
      "month": "Nov",
      "income": 0,
      "expense": 0
    },
    {
      "month": "Dec",
      "income": 0,
      "expense": 0
    },
    {
      "month": "Jan",
      "income": 0,
      "expense": 0
    },
    {
      "month": "Feb",
      "income": 651740,
      "expense": 15644.08
    },
    {
      "month": "Mar",
      "income": 10000,
      "expense": 0
    }
  ]
  data2: any = [
    {
      "_id": {
        "account_head": [
          5050,
          5022,
          5000
        ],
        "expense_by": "Professional and Consultancy Charges"
      },
      "expense_by": "Professional and Consultancy Charges",
      "expense_amount": 2500
    },
    {
      "_id": {
        "account_head": [
          5038,
          5021,
          5000
        ],
        "expense_by": "Service Expenses"
      },
      "expense_by": "Service Expenses",
      "expense_amount": 9900
    },
    {
      "_id": {
        "account_head": [
          5050,
          5022,
          5000
        ],
        "expense_by": "Software Renewal"
      },
      "expense_by": "Software Renewal",
      "expense_amount": 3244.08
    }
  ];
  chartAxis2 = [{
    type: 'pie', xaxis: 'expense_by', dataLabel: { name: 'expense_amount',showLabel:true, position:'Outside' },
    yaxis: 'expense_amount', name: 'Amount', animation: true, radius: 70, innerRadius: 30, 
    startAngle: 270, endAngle: 90,
    explode: true,
    explodeOffset: 50
  },]
  chartAxis = [
    // {
    //   type: 'doughnet',
    //   xaxis: 'month', yaxis: 'income',
    //   name: 'Income',
    //   innerRadius: 30,
    //   radius: 100,
    //   explode: true,
    //   explodeOffset: 50

    // }
    { type: 'bar', xaxis: 'month', yaxis: 'income', name: 'Income', animation: true, radius: 100 },
    { type: 'bar', xaxis: 'month', yaxis: 'expense', name: 'Expense', animation: true, radius: 100 },
    // { type: 'bar', xaxis: 'month', yaxis: 'expenses', name: 'Expenses', marker: true, animation: true },
    // { type: 'line', xaxis: 'month', yaxis: 'expenses', name: 'Expenses', marker: true, animation: true }
    // { type: 'line', xaxis: 'month', yaxis: 'income', name: 'Income', animation: true },
  ];
  revealCharts: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.revealCharts = true;
  }

}
