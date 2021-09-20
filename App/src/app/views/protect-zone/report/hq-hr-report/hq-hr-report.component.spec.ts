/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HqHrReportComponent } from './hq-hr-report.component';

describe('HqHrReportComponent', () => {
  let component: HqHrReportComponent;
  let fixture: ComponentFixture<HqHrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HqHrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HqHrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
