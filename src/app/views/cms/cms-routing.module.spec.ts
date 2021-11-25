import { CmsRoutingModule } from './cms-routing.module';

describe('CmsRoutingModule', () => {
  let cmsRoutingModule: CmsRoutingModule;

  beforeEach(() => {
    cmsRoutingModule = new CmsRoutingModule();
  });

  it('should create an instance', () => {
    expect(cmsRoutingModule).toBeTruthy();
  });
});
