export const state = () => ({
  locale: 'en',
  locales: [
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'es',
      name: 'Español'
    },
    {
      code: 'fr',
      name: 'Français'
    },
    {
      code: 'ru',
      name: 'Русский'
    },
    {
      code: 'uk',
      name: 'Українська'
    },
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
