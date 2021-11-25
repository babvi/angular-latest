import { ManageJobModule } from './manage-job.module';

describe('ManageJobModule', () => {
  let manageJobModule: ManageJobModule;

  beforeEach(() => {
    manageJobModule = new ManageJobModule();
  });

  it('should create an instance', () => {
    expect(manageJobModule).toBeTruthy();
  });
});
