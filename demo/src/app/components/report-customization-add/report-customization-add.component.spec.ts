import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCustomizationAddComponent } from './report-customization-add.component';

describe('ReportCustomizationAddComponent', () => {
  let component: ReportCustomizationAddComponent;
  let fixture: ComponentFixture<ReportCustomizationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCustomizationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCustomizationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
