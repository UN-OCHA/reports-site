import { mount } from '@vue/test-utils';
import Global from '~/components/_Global.vue';

describe('Global', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Global, {});
  });

  it('should offer some default props', () => {
    expect(wrapper.vm.renderOptions).toEqual({});
    expect(wrapper.vm.formatTimestamps).toBe(true);
  });

  it('should respond with languageDirection:rtl for he/ar', () => {
    expect(wrapper.vm.languageDirection('ar')).toBe('rtl');
    expect(wrapper.vm.languageDirection('he')).toBe('rtl');
  });

  it('should respond with languageDirection:ltr for anything else', () => {
    // fake
    expect(wrapper.vm.languageDirection('aa')).toBe('ltr');

    // real
    expect(wrapper.vm.languageDirection('en')).toBe('ltr');
    expect(wrapper.vm.languageDirection('es')).toBe('ltr');
    expect(wrapper.vm.languageDirection('fr')).toBe('ltr');
    expect(wrapper.vm.languageDirection('ru')).toBe('ltr');
  });

  it('should respond with a component map for various CTF content-types', () => {
    expect(wrapper.vm.componentMap.article).toBe('Article');
    expect(wrapper.vm.componentMap.articleRegional).toBe('Article');
    expect(wrapper.vm.componentMap.clusterInformation).toBe('Cluster');
    expect(wrapper.vm.componentMap.flashUpdate).toBe('FlashUpdate');
    expect(wrapper.vm.componentMap.interactive).toBe('Interactive');
    expect(wrapper.vm.componentMap.video).toBe('Video');
    expect(wrapper.vm.componentMap.visual).toBe('Visual');
  });

  afterEach(() => {
    wrapper.destroy();
  });
});
