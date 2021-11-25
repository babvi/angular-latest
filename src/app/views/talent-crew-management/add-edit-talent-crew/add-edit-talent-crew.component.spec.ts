import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTalentCrewComponent } from './add-edit-talent-crew.component';

describe('AddEditTalentCrewComponent', () => {
  let component: AddEditTalentCrewComponent;
  let fixture: ComponentFixture<AddEditTalentCrewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditTalentCrewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTalentCrewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
