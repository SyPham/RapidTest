/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RapidTestReportComponent } from './rapid-test-report.component';

describe('RapidTestReportComponent', () => {
  let component: RapidTestReportComponent;
  let fixture: ComponentFixture<RapidTestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapidTestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapidTestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
