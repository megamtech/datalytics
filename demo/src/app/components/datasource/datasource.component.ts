import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from '../../_services/api.service';
export class DataSource {
  name: string;
  description: string;
  method: API_METHOD_TYPE;
  url: string;
  datatype: DATA_TYPE;
  authorization: string;
  body: string;
  username: string;
  password: string;
  token: string;
}

export type API_METHOD_TYPE = 'get' | 'post';
export type DATA_TYPE = 'json' | 'html';

@Component({
  selector: 'datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.scss']
})
export class DatasourceComponent implements OnInit {
  dataSource = { data: [], count: 0 };
  tableColumns = [];
  @ViewChild('actionTemplate', { static: true }) actionTemplate: TemplateRef<any>;
  constructor(public http: ApiService) {
  }

  ngOnInit(): void {
    console.log('Hello');
    this.getDataSourceList();
    this.tableColumns = [
      { prop: 'name', name: 'Name', dataType: 'text', show: true },
      { prop: 'category', name: 'Category', dataType: 'text', show: true },
      { prop: 'created_at', name: 'Created Date', dataType: 'date', show: true },
      { prop: 'updated_at', name: 'Last Updated', dataType: 'date', show: true },
      {
        prop: '_id', show: true, dataType: 'text',
        template: this.actionTemplate
      }
    ];
  }
  getDataSourceList() {
    this.http.post('http://localhost/datalyticsapi/datasource/list', {}).toPromise().then((response: any) => {
      this.dataSource = response;
      console.log('response==>', response);
    });
  }

  deleteDataSource(muid: string) {
    this.http.get('http://localhost/datalyticsapi/datasource/delete/' + muid).toPromise().then((response) => {
      console.log(response);
    });
  }
  convertToReport(muid) {
    this.http.get('http://localhost/datalyticsapi/datasource/convertoreport/' + muid).toPromise().then((response) => {
      console.log(response);
    });
  }
}
