import { CategoryRoutingModule } from './category-routing.module';

describe('CategoryRoutingModule', () => {
  let categoryRoutingModule: CategoryRoutingModule;

  beforeEach(() => {
    categoryRoutingModule = new CategoryRoutingModule();
  });

  it('should create an instance', () => {
    expect(categoryRoutingModule).toBeTruthy();
  });
});
