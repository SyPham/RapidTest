/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { H1H2ReportComponent } from './h1-h2-report.component';

describe('H1H2ReportComponent', () => {
  let component: H1H2ReportComponent;
  let fixture: ComponentFixture<H1H2ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ H1H2ReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(H1H2ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
