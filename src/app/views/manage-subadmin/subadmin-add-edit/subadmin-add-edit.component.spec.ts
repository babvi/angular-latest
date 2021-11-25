import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubadminAddEditComponent } from './subadmin-add-edit.component';

describe('SubadminAddEditComponent', () => {
  let component: SubadminAddEditComponent;
  let fixture: ComponentFixture<SubadminAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubadminAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubadminAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
