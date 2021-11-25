import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentCrewManagementComponent } from './talent-crew-management.component';

describe('TalentCrewManagementComponent', () => {
  let component: TalentCrewManagementComponent;
  let fixture: ComponentFixture<TalentCrewManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentCrewManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentCrewManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
