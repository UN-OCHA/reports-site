import { mount } from '@vue/test-utils';
import Video from '~/components/Video.vue';

describe('Video', () => {
  let wrapper;
  let mocks = {
    $store: {
      state: {
        locale: 'un',
        locales: [
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
    $t (str) {
      return str;
    },
  };

  beforeEach(() => {
    wrapper = mount(Video, {
      propsData: {
        content: {
          sys: {
            id: 'unit1',
          },
          fields: {
            videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
            description: {},
          },
        },
        options: {
          newWindow: true,
        },
      },
      mocks,
      stubs: [
        'nuxt-link',
        'client-only',
      ],
    });
  });

  it('should render the component', () => {
    expect(wrapper.find('.video__embed').html()).toContain('<a data-video-slug');
  });

  it('should have a CSS ID matching CTF payload', () => {
    expect(wrapper.vm.cssIdSelector).toBe('#cf-unit1');
  });

  it('should render a link to Video', () => {
    expect(wrapper.vm.videoEmbedSrc).toBe(`https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1&rel=0&controls=0&showinfo=0`);
  });

  it('should process video when prompted', () => {
    expect(wrapper.vm.videoProcessed).toBe(false);
    wrapper.vm.processVideo();
    expect(wrapper.vm.videoProcessed).toBe(true);
  });

  afterEach(() => {
    wrapper.destroy();
  });
});
