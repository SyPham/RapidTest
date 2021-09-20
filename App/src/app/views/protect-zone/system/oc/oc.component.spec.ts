/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OcComponent } from './oc.component';

describe('OcComponent', () => {
  let component: OcComponent;
  let fixture: ComponentFixture<OcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
