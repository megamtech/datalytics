import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCustomizationComponent } from './report-customization.component';

describe('ReportCustomizationComponent', () => {
  let component: ReportCustomizationComponent;
  let fixture: ComponentFixture<ReportCustomizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCustomizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
