import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPermissionComponent } from './subscription-permission.component';

describe('SubPermissionComponent', () => {
  let component: SubPermissionComponent;
  let fixture: ComponentFixture<SubPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
