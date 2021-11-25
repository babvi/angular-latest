import { RolePermissionModule } from './role-permission.module';

describe('RolePermissionModule', () => {
  let rolePermissionModule: RolePermissionModule;

  beforeEach(() => {
    rolePermissionModule = new RolePermissionModule();
  });

  it('should create an instance', () => {
    expect(rolePermissionModule).toBeTruthy();
  });
});
