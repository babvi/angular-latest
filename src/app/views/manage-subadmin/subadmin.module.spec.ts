import { SubadminModule } from './subadmin.module';

describe('SubadminModule', () => {
  let subadminModule: SubadminModule;

  beforeEach(() => {
    subadminModule = new SubadminModule();
  });

  it('should create an instance', () => {
    expect(subadminModule).toBeTruthy();
  });
});
