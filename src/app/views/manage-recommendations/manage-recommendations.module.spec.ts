import { ManageRecommendationsModule } from './manage-recommendations.module';

describe('ManageRecommendationsModule', () => {
  let manageRecommendationsModule: ManageRecommendationsModule;

  beforeEach(() => {
    manageRecommendationsModule = new ManageRecommendationsModule();
  });

  it('should create an instance', () => {
    expect(manageRecommendationsModule).toBeTruthy();
  });
});
