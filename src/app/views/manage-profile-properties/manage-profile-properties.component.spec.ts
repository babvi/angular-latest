import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProfilePropertiesComponent } from './manage-profile-properties.component';

describe('ManageProfilePropertiesComponent', () => {
  let component: ManageProfilePropertiesComponent;
  let fixture: ComponentFixture<ManageProfilePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProfilePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProfilePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
