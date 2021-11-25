import { SubPermissionRoutingModule } from './subscription-permission-routing.module';

describe('SubPermissionRoutingModule', () => {
  let subPermissionRoutingModule: SubPermissionRoutingModule;

  beforeEach(() => {
    subPermissionRoutingModule = new SubPermissionRoutingModule();
  });

  it('should create an instance', () => {
    expect(subPermissionRoutingModule).toBeTruthy();
  });
});
