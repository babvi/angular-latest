import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HCCComponent } from './hcc.component';

describe('HCCComponent', () => {
  let component: HCCComponent;
  let fixture: ComponentFixture<HCCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HCCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HCCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
