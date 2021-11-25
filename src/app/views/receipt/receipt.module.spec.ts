import { ReceiptModule } from './receipt.module';

describe('SubscriptionModule', () => {
  let receiptModule: ReceiptModule;

  beforeEach(() => {
    receiptModule = new ReceiptModule();
  });

  it('should create an instance', () => {
    expect(receiptModule).toBeTruthy();
  });
});
