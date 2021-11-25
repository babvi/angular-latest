import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTreeviewComponent } from './category-treeview.component';

describe('CategoryAddEditComponent', () => {
  let component: CategoryTreeviewComponent;
  let fixture: ComponentFixture<CategoryTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
