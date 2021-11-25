import { HCCRoutingModule } from './hcc-routing.module';

describe('HCCRoutingModule', () => {
  let hccRoutingModule: HCCRoutingModule;

  beforeEach(() => {
    hccRoutingModule = new HCCRoutingModule();
  });

  it('should create an instance', () => {
    expect(hccRoutingModule).toBeTruthy();
  });
});
