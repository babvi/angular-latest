import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobListComponent } from './manage-job-list.component';

describe('ManageJobListComponent', () => {
  let component: ManageJobListComponent;
  let fixture: ComponentFixture<ManageJobListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageJobListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
