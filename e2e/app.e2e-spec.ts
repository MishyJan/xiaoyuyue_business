import { XiaoyuyuePage } from './app.po';

describe('xiaoyuyue App', function() {
  let page: XiaoyuyuePage;

  beforeEach(() => {
    page = new XiaoyuyuePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
