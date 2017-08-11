import { LocksmithPage } from './app.po';

describe('locksmith App', () => {
  let page: LocksmithPage;

  beforeEach(() => {
    page = new LocksmithPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
