export const state = () => ({
  //
  // Define each Language
  //
  // code: this is the ISO 2-character language code. We don't support locales,
  //     despite the name of all the variables below.
  //
  // name: the language's own name for itself. Our translation files contain the
  //     specific names of each language.
  //
  // dir: the reading direction as it pertains to HTML. The two options are
  //     * ltr - left-to-right
  //     * rtl - right-to-left
  //
  // display: a DSR-specific property that sets a default which controls generic
  //     pages such as home/about/etc. These pages only feature the languages in
  //     the "UN 6" group, but can still be rendered in other languages when
  //     navigating from a SitRep or a direct URL.
  //
  //     When a SitRep is authored in multiple languages the property is always
  //     forced to `true`, meaning the language selection of SitReps is based
  //     solely on what languages the Offices have authored their content in.
  //
  locales: [
    //
    // Official UN Languages
    //
    {
      code: 'en',
      name: 'English',
      dir: 'ltr',
      display: true,
      fallback: 'en',
    },
    {
      code: 'es',
      name: 'Español',
      dir: 'ltr',
      display: true,
      fallback: 'es',
    },
    {
      code: 'fr',
      name: 'Français',
      dir: 'ltr',
      display: true,
      fallback: 'fr',
    },
    {
      code: 'ru',
      name: 'Русский',
      dir: 'ltr',
      display: true,
      fallback: 'ru',
    },
    {
      code: 'ar',
      name: 'عربي',
      dir: 'rtl',
      display: true,
      fallback: 'ar',
    },
    // {
    //   code: 'zh',
    //   name: '中文',
    //   dir: 'ltr', // Following www.un.org/zh/ for direction
    //   display: true,
    //   fallback: 'zh',
    // },

    //
    // Local languages
    //
    // * All languages below this comment MUST have `display: false`
    //
    // * The `fallback` MUST be one of the active UN-official languages in the
    //   block defined above these Local Languages. Some of our dependencies
    //   don't support all of our local languages and each region should decide
    //   what language they prefer as their fallback.
    //
    {
      code: 'rn',
      name: 'Ikirundi',
      dir: 'ltr',
      display: false,
      fallback: 'fr',
    },
    {
      code: 'so',
      name: 'Soomaali',
      dir: 'ltr',
      display: false,
      fallback: 'fr',
    },
    {
      code: 'uk',
      name: 'Українська',
      dir: 'ltr',
      display: false,
      fallback: 'ru',
    },
  ],

  // Default site language. Changing this will break our translation system.
  locale: 'en',

  // Allow sub-components of a SitRep to display the Title/Date of a SitRep by
  // holding the current URL's metadata in the store. Used by Snap PNGs and also
  // to construct CardUrl URLs.
  reportMeta: {
    slug: '',
    title: '',
    dateUpdated: '',
    language: '',
  },

  // Lets the whole app know about the AppBar state.
  appbar: {
    isExpanded: false,
  },

  // Lets the whole app render dates consistently when context requires it.
  // e.g. Used by Snaps to render PDF/PNGs with absolute dates.
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
      slug: meta.slug,
      title: meta.title,
      dateUpdated: meta.dateUpdated,
      language: meta.language,
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
