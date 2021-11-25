import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAddEditComponent } from './email-add-edit.component';

describe('EmailAddEditComponent', () => {
  let component: EmailAddEditComponent;
  let fixture: ComponentFixture<EmailAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
