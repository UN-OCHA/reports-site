export const state = () => ({
  locales: [
    {
      code: 'en',
      name: 'EN'
    },
    {
      code: 'fr',
      name: 'FR'
    }
  ],
  locale: 'fr'
});

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.find(el => el.code === locale)) {
      state.locale = locale
    }
  }
};
