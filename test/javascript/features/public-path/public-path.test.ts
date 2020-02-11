import { URL } from 'url';
import axios from 'axios';
import Scripts from '../../../scripts';

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'javascript',
});

describe.each(['prod', 'dev'] as const)('public path [%s]', mode => {
  const publicPath = 'http://some-public-path/';

  forwaradRequestsFromPublicPathToRealStatics();

  it('overrides public path by YOSHI_PUBLIC_PATH env var', async () => {
    await scripts[mode](
      async () => {
        await page.goto(scripts.serverUrl);

        const result = await page.$eval('#component', elm => elm.textContent);

        expect(result).toBe('some text');
      },
      { env: { YOSHI_PUBLIC_PATH: publicPath } },
    );
  });

  async function forwaradRequestsFromPublicPathToRealStatics() {
    beforeAll(async () => {
      await page.setRequestInterception(true);

      page.on('request', async interceptedRequest => {
        const url = interceptedRequest.url();

        if (url.includes(publicPath)) {
          const forwardToUrl = `${scripts.staticsServerUrl}${
            new URL(url).pathname
          }`;
          const { data: body } = await axios.get(forwardToUrl);

          interceptedRequest.respond({ body });
        } else {
          interceptedRequest.continue();
        }
      });
    });

    afterEach(() => jestPuppeteer.resetPage());

    afterAll(() => page.setRequestInterception(false));
  }
});
