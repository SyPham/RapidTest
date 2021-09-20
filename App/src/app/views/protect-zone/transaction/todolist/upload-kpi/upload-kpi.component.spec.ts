/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UploadKpiComponent } from './upload-kpi.component';

describe('UploadKpiComponent', () => {
  let component: UploadKpiComponent;
  let fixture: ComponentFixture<UploadKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
