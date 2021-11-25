import { EmailRoutingModule } from './email-routing.module';

describe('EmailRoutingModule', () => {
  let emailRoutingModule: EmailRoutingModule;

  beforeEach(() => {
    emailRoutingModule = new EmailRoutingModule();
  });

  it('should create an instance', () => {
    expect(emailRoutingModule).toBeTruthy();
  });
});
