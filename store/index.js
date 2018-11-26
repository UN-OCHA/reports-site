export const state = () => ({
  locale: 'fr',
  locales: [
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'fr',
      name: 'Français'
    }
  ],
  reportMeta: {
    title: '',
    dateUpdated: '',
  },
});

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.find(el => el.code === locale)) {
      state.locale = locale
    }
  },

  SET_META(state, meta) {
    state.reportMeta = {
      title: meta.title,
      dateUpdated: meta.dateUpdated,
    }
  }
};
