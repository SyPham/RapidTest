/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Q1Q3ReportComponent } from './q1-q3-report.component';

describe('Q1Q3ReportComponent', () => {
  let component: Q1Q3ReportComponent;
  let fixture: ComponentFixture<Q1Q3ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Q1Q3ReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Q1Q3ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
