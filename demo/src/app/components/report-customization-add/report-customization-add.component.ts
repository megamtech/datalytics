import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ApiService } from '../../_services/api.service';
@Component({
  selector: 'customization-add',
  templateUrl: './report-customization-add.component.html',
  styleUrls: ['./report-customization-add.component.scss']
})
export class ReportCustomizationAddComponent implements OnInit {
  id: string;
  reportCustomization: any = null;
  type: string = 'edit' || 'clone';
  configOptions: any = { data: null, actionType: '' };
  constructor(private route: ActivatedRoute, public http: ApiService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');

    if (this.type != null) {
      // TODO USE default url if not present
      this.http.get('http://localhost/datalyticsapi/customization/' + this.id).toPromise().then((response) => {
        console.log(response);
        this.reportCustomization = response;
      });
    }
  }
  onReportEvent(data) {
    console.log('data', data);
    if (data.actionType === 'save') {
      this.saveCustomizationData(data.data);
    } else if (data.actionType === 'reportCustomizationList') {
      this.getReportCustomizations(data.actionType);
    }
  }
  getReportCustomizations(actionType: string) {
    this.http.post('http://localhost/datalyticsapi/customization/list', { filters: {} }).toPromise().then((response: any) => {
      this.configOptions = { data: response.data, actionType };
      console.log('ConfigOptions===========>>>', this.configOptions);
    });
  }
  saveCustomizationData(data) {
    if (this.type === 'edit') {
      this.http.post('http://localhost/datalyticsapi/customization/update/' + this.id, data).toPromise().then((response) => {
        console.log(response);
      });
    } else {
      this.http.post('http://localhost/datalyticsapi/customization/add', data).toPromise().then((response) => {
        console.log(response);
      });
    }
  }
}
