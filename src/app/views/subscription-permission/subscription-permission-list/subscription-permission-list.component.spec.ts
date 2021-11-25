import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPermissionListComponent } from './subscription-permission-list.component';

describe('SubPermissionListComponent', () => {
  let component: SubPermissionListComponent;
  let fixture: ComponentFixture<SubPermissionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubPermissionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubPermissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
