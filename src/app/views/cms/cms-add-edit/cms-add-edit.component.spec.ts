import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsAddEditComponent } from './cms-add-edit.component';

describe('CmsAddEditComponent', () => {
  let component: CmsAddEditComponent;
  let fixture: ComponentFixture<CmsAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
