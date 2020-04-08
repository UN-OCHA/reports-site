import { mount } from '@vue/test-utils';
import AppBar from '~/components/AppBar.vue';

describe('AppBar', () => {
  let wrapper;
  let mocks = {
    $store: {
      state: {},
      commit: jest.fn(),
    },
    $t (str) {
      return str;
    },
    $i18n: {
      path (path) {
        return '/unit/' + path;
      },
    },
  };

  beforeEach(() => {
    wrapper = mount(AppBar, {
      mocks,
      stubs: [
        'nuxt-link',
        'client-only',
      ],
    });
  });

  it('should render the component', () => {
    expect(wrapper.find('.app-bar').html()).toContain('UN Office for the Coordination of Humanitarian Affairs');
  });

  it('should toggle menu when toggleMenu() runs', () => {
    wrapper.vm.toggleMenu();
    expect(wrapper.vm.isExpanded).toBe(true);
    expect(mocks.$store.commit.mock.calls.length).toBe(0);
  });

  it('should close menu when closeMenu() runs', () => {
    wrapper.setData({
      isExpanded: true,
    });
    wrapper.vm.closeMenu();
    expect(wrapper.vm.isExpanded).toBe(false);
    expect(mocks.$store.commit.mock.calls.length).toBe(1);
  });

  it('should open menu when openMenu() runs', async () => {
    wrapper.setData({
      isExpanded: false,
    });
    wrapper.vm.openMenu();
    expect(wrapper.vm.isExpanded).toBe(true);
    expect(mocks.$store.commit.mock.calls.length).toBe(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.app-bar').html()).toContain('is--expanded');
  });

  it('should close menu when [ESC] is pressed', async () => {
    wrapper.setData({
      isExpanded: true,
    });
    wrapper.trigger('keyup.esc');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isExpanded).toBe(false);
  });

  afterEach(() => {
    wrapper.destroy();
  });
});
