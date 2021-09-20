/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PdcaComponent } from './pdca.component';

describe('PdcaComponent', () => {
  let component: PdcaComponent;
  let fixture: ComponentFixture<PdcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
