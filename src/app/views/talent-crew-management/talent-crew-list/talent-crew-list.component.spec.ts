import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentCrewListComponent } from './talent-crew-list.component';

describe('TalentCrewListComponent', () => {
  let component: TalentCrewListComponent;
  let fixture: ComponentFixture<TalentCrewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentCrewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentCrewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
