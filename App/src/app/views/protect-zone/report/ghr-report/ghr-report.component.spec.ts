/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GhrReportComponent } from './ghr-report.component';

describe('GhrReportComponent', () => {
  let component: GhrReportComponent;
  let fixture: ComponentFixture<GhrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
