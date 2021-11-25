import { TalentCrewManagementModule } from './talent-crew-management.module';

describe('TalentCrewManagementModule', () => {
  let talentCrewManagementModule: TalentCrewManagementModule;

  beforeEach(() => {
    talentCrewManagementModule = new TalentCrewManagementModule();
  });

  it('should create an instance', () => {
    expect(talentCrewManagementModule).toBeTruthy();
  });
});
