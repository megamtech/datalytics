import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceAddComponent } from './datasource-add.component';

describe('DatasourceAddComponent', () => {
  let component: DatasourceAddComponent;
  let fixture: ComponentFixture<DatasourceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
