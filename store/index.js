export const state = () => ({
  locale: 'en',
  locales: [
    {
      code: 'en',
      name: 'English',
      dir: 'ltr',
    },
    {
      code: 'es',
      name: 'Español',
      dir: 'ltr',
    },
    {
      code: 'fr',
      name: 'Français',
      dir: 'ltr',
    },
    {
      code: 'ru',
      name: 'Русский',
      dir: 'ltr',
    },
    {
      code: 'uk',
      name: 'Українська',
      dir: 'ltr',
    },
    {
      code: 'ar',
      name: 'عربي',
      dir: 'rtl',
    },
  ],
  reportMeta: {
    title: '',
    dateUpdated: '',
  },
  appbar: {
    isExpanded: false,
  },
  globalFormatting: {
    formatTimestamps: 'auto',
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
  },

  SET_APPBAR(state, bool) {
    state.appbar = {
      isExpanded: bool,
    }
  },

  SET_GLOBAL_TIMESTAMP_FORMATTING(state, setting) {
    state.globalFormatting.formatTimestamps = setting;
  },
};
