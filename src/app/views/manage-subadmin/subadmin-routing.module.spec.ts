import { SubadminRoutingModule } from './subadmin-routing.module';

describe('SubadminRoutingModule', () => {
  let subadminRoutingModule: SubadminRoutingModule;

  beforeEach(() => {
    subadminRoutingModule = new SubadminRoutingModule();
  });

  it('should create an instance', () => {
    expect(subadminRoutingModule).toBeTruthy();
  });
});
