import { SubPermissionModule } from './subscription-permission.module';

describe('SubPermissionModule', () => {
  let subPermissionModule: SubPermissionModule;

  beforeEach(() => {
    subPermissionModule = new SubPermissionModule();
  });

  it('should create an instance', () => {
    expect(subPermissionModule).toBeTruthy();
  });
});
