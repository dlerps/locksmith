import { PwOnlinePage } from './app.po';

describe('pw-online App', function() {
  let page: PwOnlinePage;

  beforeEach(() => {
    page = new PwOnlinePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
