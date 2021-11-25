import { HCCModule } from './hcc.module';

describe('HCCModule', () => {
  let hccModule: HCCModule;

  beforeEach(() => {
    hccModule = new HCCModule();
  });

  it('should create an instance', () => {
    expect(hccModule).toBeTruthy();
  });
});
