import { ManageProfilePropertiesModule } from './manage-profile-properties.module';

describe('ManageProfilePropertiesModule', () => {
  let manageProfilePropertiesModule: ManageProfilePropertiesModule;

  beforeEach(() => {
    manageProfilePropertiesModule = new ManageProfilePropertiesModule();
  });

  it('should create an instance', () => {
    expect(manageProfilePropertiesModule).toBeTruthy();
  });
});
