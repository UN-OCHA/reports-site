import { mount } from '@vue/test-utils';
import AppHeader from '~/components/AppHeader.vue';

describe('AppHeader', () => {
  let wrapper;
  let propsData = {
    title: 'Unit Title',
    subtitle: 'Unit Subtitle',
  };
  let mocks = {
    $store: {
      state: {
        locale: 'un',
        locales: [
          {
            code: 'en',
            name: 'English',
            dir: 'ltr',
            display: true,
            fallback: 'en',
          },
          {
            code: 'un',
            name: 'Unitese',
            dir: 'ltr',
            display: false,
            fallback: 'en',
          },
        ],
        globalFormatting: {
          formatTimestamps: true,
        },
        reportMeta: {
          language: 'un',
        },
      },
      commit: jest.fn(),
    },
    $i18n: {
      path (path) {
        return '/unit/' + path;
      },
    },
    $moment() {
      return {
        diff() {
          return 'unit days ago';
        },
        format() {
          return 'unit format';
        },
        locale() {
          return {
            format() {
              return 'unit localized';
            },
          };
        },
      };
    },
    $route: {
      path: '/en/country/unit',
    },
    $t (str) {
      return str;
    },
  };

  // For wrapper.vm.envClass
  delete window.location;
  window.location = new URL('https://dev.reports-unocha-org.ahconu.org');
  const fakeWindowLocationHref = 'https%3A%2F%2Fdev.reports-unocha-org.ahconu.org%2F';

  beforeEach(() => {
    wrapper = mount(AppHeader, {
      propsData,
      mocks,
      stubs: [
        'nuxt-link',
        'client-only',
      ],
    });
  });

  it('should render the component', () => {
    expect(wrapper.find('img.logo').html()).toContain('UN Office for the Coordination of Humanitarian Affairs');
  });

  it('should toggle Share when prompted', () => {
    wrapper.vm.toggleShare();
    expect(wrapper.vm.shareIsOpen).toBe(true);
    wrapper.vm.toggleShare();
    expect(wrapper.vm.shareIsOpen).toBe(false);
  });

  it('should open Share when prompted', () => {
    wrapper.vm.openShare();
    expect(wrapper.vm.shareIsOpen).toBe(true);
  });

  it('should close Share when prompted', () => {
    wrapper.vm.openShare();
    expect(wrapper.vm.shareIsOpen).toBe(true);
    wrapper.vm.closeShare();
    expect(wrapper.vm.shareIsOpen).toBe(false);
  });

  it('should maintain language-free URL context for localization', () => {
    expect(wrapper.vm.urlContext).toBe('country/unit');
  });

  it('should produce the current, localized date using moment.js', () => {
    expect(wrapper.vm.today).toContain('unit localized');
  });

  it('should set an environment class when necessary', async () => {
    expect(wrapper.vm.envClass).toBe('dev');
    expect(wrapper.find('.env').html()).toContain('viewing the <strong>dev</strong> Environment');

    // TODO: cover the demo-format URL.
  });

  it('should use custom set of translations when necessary', async () => {
    wrapper.setProps({
      translations: [
        {
          code: 'en',
          name: 'English',
          dir: 'ltr',
          display: true,
          fallback: 'en',
        },
        {
          code: 'un',
          name: 'Unitese',
          dir: 'ltr',
          display: true,
          fallback: 'en',
        }
      ],
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.lang-switcher').html()).toContain('/en/country/unit');
    expect(wrapper.find('.lang-switcher').html()).toContain('/un/country/unit');
  });

  it('should show custom Archive link when supplied', () => {
    wrapper.setData({
      customArchive: 'https://example.com',
    });
    expect(wrapper.vm.archiveLink).toBe('https://example.com');
  });

  it('should show standard Archive link when countryCode is valid', async () => {
    wrapper.setProps({
      countrycode: 'uno',
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.archiveLink).toContain('iso3:uno');
  });

  it('should show no Archive link when countryCode is valid', () => {
    wrapper.setProps({
      countrycode: 'ro1',
    });
    expect(wrapper.vm.archiveLink).toBe('');
  });

  it('should show no Archive link when neither is supplied', () => {
    wrapper.setData({
      customArchive: '',
    });
    wrapper.setProps({
      countrycode: '',
    });
    expect(wrapper.vm.archiveLink).toBe('');
  });

  it('should generate a Share message', () => {
    expect(wrapper.vm.shareMessage).toContain('Read the latest from Unit');
  });

  it('should generate a Share base URL on the client', () => {
    expect(wrapper.vm.shareBaseUrl).toContain('dev.reports-unocha-org.ahconu.org');
  });

  // it('should generate a Share base URL on the server', () => {
  //   // This can apparently be done in a separate file using a docblock but
  //   // the first attempt yielded other issues mounting components, which
  //   // expect to be in a browser environment. For now, a TODO.
  //   //
  //   // @see https://stackoverflow.com/a/48691959
  // });

  it('should generate a share URL for Facebook', () => {
    expect(wrapper.vm.shareUrlFacebook).toContain('facebook.com/sharer/sharer.php?u=' + fakeWindowLocationHref);
  });

  it('should generate a share URL for Twitter', () => {
    expect(wrapper.vm.shareUrlTwitter).toContain('twitter.com/intent/tweet?text=');
    expect(wrapper.vm.shareUrlTwitter).toContain(fakeWindowLocationHref);
  });

  it('should generate a share URL for Email', () => {
    expect(wrapper.vm.shareUrlEmail).toContain('mailto:');
    expect(wrapper.vm.shareUrlEmail).toContain('Situation Report: Unit Title');
    expect(wrapper.vm.shareUrlEmail).toContain(fakeWindowLocationHref);
  });

  afterEach(() => {
    wrapper.destroy();
  });
});
