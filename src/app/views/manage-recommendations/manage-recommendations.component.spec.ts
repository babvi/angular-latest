import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRecommendationsComponent } from './manage-recommendations.component';

describe('ManageRecommendationsComponent', () => {
  let component: ManageRecommendationsComponent;
  let fixture: ComponentFixture<ManageRecommendationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRecommendationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
