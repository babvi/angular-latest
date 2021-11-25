import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobViewComponent } from './manage-job-view.component';

describe('ManageJobViewComponent', () => {
  let component: ManageJobViewComponent;
  let fixture: ComponentFixture<ManageJobViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageJobViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJobViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
