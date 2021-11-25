import { CmsModule } from './cms.module';

describe('CmsModule', () => {
  let cmsModule: CmsModule;

  beforeEach(() => {
    cmsModule = new CmsModule();
  });

  it('should create an instance', () => {
    expect(cmsModule).toBeTruthy();
  });
});
