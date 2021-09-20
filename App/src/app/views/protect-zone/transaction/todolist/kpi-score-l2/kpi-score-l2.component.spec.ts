/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KpiScoreL2Component } from './kpi-score-l2.component';

describe('KpiScoreL2Component', () => {
  let component: KpiScoreL2Component;
  let fixture: ComponentFixture<KpiScoreL2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiScoreL2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreL2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
