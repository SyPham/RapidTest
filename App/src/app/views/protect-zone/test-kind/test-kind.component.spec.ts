/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TestKindComponent } from './test-kind.component';

describe('TestKindComponent', () => {
  let component: TestKindComponent;
  let fixture: ComponentFixture<TestKindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestKindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
