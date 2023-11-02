import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../_services/api.service';
import { DataSource } from '../datasource.component';

@Component({
  selector: 'datasource-add',
  templateUrl: './datasource-add.component.html',
  styleUrls: ['./datasource-add.component.scss']
})
export class DatasourceAddComponent implements OnInit {
  dataSourceData: any = {};
  // dataSource: DataSource = new DataSource();
  id: string;
  type: string = 'edit' || 'clone';
  response: any;
  previewData: any = {};
  tables: any;
  tabledef: any;
  _tableDef;
  _tables;
  _databases;
  // constructor() { }

  constructor(public http: ApiService, private route: ActivatedRoute) {
    // this.dataSource.method = 'get';
    // this.dataSource.datatype = 'json';
    // this.dataSource.authorization = 'no_auth';
    // this.editorOptions = new JsonEditorOptions();
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    // // this.options.mode = 'code'; //set only one mode

    // this.data = {
    //   'products': [{
    //     'name': 'car', 'product': [{
    //       'name': 'honda', 'model':
    //         [{ 'id': 'civic', 'name': 'civic' }, { 'id': 'accord', 'name': 'accord' },
    //         { 'id': 'crv', 'name': 'crv' }, { 'id': 'pilot', 'name': 'pilot' },
    //         { 'id': 'odyssey', 'name': 'odyssey' }]
    //     }]
    //   }]
    // };

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');
    if (this.type != null) {
      this.viewDataSource();
    }
  }
  viewDataSource() {
    this.http.get('http://localhost/datalyticsapi/datasource/view/' + this.id).toPromise().then((result: any) => {
      this.dataSourceData = result;
      console.log('TEST$');
      // this.getDatabaseList(result.data);
    });
  }
  saveDataSource(result) {
    console.log(result);
    if (result.actionType === 'save') {

      if (this.type === 'edit') {
        if (result.data.category == 'file') {
          if (Object.keys(result.data.file.upload.file[0]).length == 0) {
            this.uploadFile(result.data);
          } else {
            if (result.data.file.upload.file != undefined) {
              delete result.data.file.upload.file;
            }
            this.updateDataSource(result.data, result.data._id);
          }
        } else {
          this.updateDataSource(result.data, result.data._id);
        }

      } else if (result.data.category == 'file' && result.data.file.type == "upload") {
        this.uploadFile(result.data)
      } else {
        this.http.post('http://localhost/datalyticsapi/datasource/add', result.data)
          .toPromise().then((response: any) => {
            console.log('response=====>>>', response);
          });
      }
    }

    if (result.actionType === 'fetchdbs') {
      this.dataSourceData = result.data;
      this.getDatabaseList(result.data, true);
    }
  }
  updateDataSource(data, id: string) {
    this.http.post('http://localhost/datalyticsapi/datasource/update/' + id, data)
      .toPromise().then((response: any) => {
        console.log('response=====>>>', response);
      });
  }
  getConnectionDetails(result) {
    console.log(result);
    if (result.type === 'fetchdbs') {
      console.log('TEST#');
      this.getDatabaseList(result.data);
    }
    if (result.type === 'fetchtables') {
      console.log('TEST!');
      this.getTableList(result.data);
    }
    if (result.type === 'fetchtabledef') {
      console.log('TABLE 6');
      this.getTableDefinition(result.data);
    }

  }
  getDatabaseList(data, isDataSourceAdd = false) {
    this.http.post('http://localhost/datalyticsapi/database/list', this.dataSourceData).toPromise().then((response: any) => {
      if (isDataSourceAdd) {
        this.previewData = {};
        this.previewData.databases = response.result;
      } else {
        this._databases = response.result;
        this._databases = response.result;
      }
    });
  }
  fetchTables() {
    this.getTableList(this.dataSourceData);
  }
  getTableList(data) {
    console.log('TEST2', this.dataSourceData);

    this.http.post('http://localhost/datalyticsapi/dataset/list', this.dataSourceData).toPromise().then((response: any) => {
      this._tables = response.result;
      console.log(this.previewData);
    });
  }
  getTableDefinition(data) {
    this.dataSourceData['db']['table_name'] = data;
    this.http.post('http://localhost/datalyticsapi/datasetfields/list', this.dataSourceData).toPromise().then((response: any) => {
      this._tableDef = response.result;
    });
  }
  testAPI() {
    this.http.post('http://localhost/datalyticsapi/datasource/test', this.dataSourceData).toPromise().then((response: any) => {
      this.response = response.response;
    });
  }
  saveQuery(query: any) {
    const data = query['data'];
    this.dataSourceData['db']['columns'] = data['columns'];
    this.dataSourceData['db']['table'] = data['table'];
    this.dataSourceData['db']['joins'] = data['joins'];
    this.dataSourceData['db']['condition'] = data['condition'];
    this.dataSourceData['db']['limit'] = data['limit'];
    this.dataSourceData['db']['offset'] = data['offset'];
    this.http.post('http://localhost/datalyticsapi/dataset/query/' + this.id, this.dataSourceData).toPromise().then((response: any) => {
      this.response = response.response;
    });
  };

  uploadFile(data) {
    let file = data.file.upload.file;
    let doc = { ...data };
    delete doc['file']['upload']['file'];

    this.http.uploadFile('http://localhost/datalyticsapi/datasource/upload', file, doc).toPromise().then((response: any) => {
      console.log('response=====>>>', response);
    });
  }

}
