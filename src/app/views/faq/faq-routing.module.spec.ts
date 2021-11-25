import { FaqRoutingModule } from './faq-routing.module';

describe('FaqRoutingModule', () => {
  let faqRoutingModule: FaqRoutingModule;

  beforeEach(() => {
    faqRoutingModule = new FaqRoutingModule();
  });

  it('should create an instance', () => {
    expect(faqRoutingModule).toBeTruthy();
  });
});
