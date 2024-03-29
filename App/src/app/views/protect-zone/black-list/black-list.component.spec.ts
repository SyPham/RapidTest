/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BlackListComponent } from './black-list.component';

describe('BlackListComponent', () => {
  let component: BlackListComponent;
  let fixture: ComponentFixture<BlackListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlackListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
