/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KpiScoreComponent } from './kpi-score.component';

describe('KpiScoreComponent', () => {
  let component: KpiScoreComponent;
  let fixture: ComponentFixture<KpiScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
