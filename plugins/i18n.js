import Vue from 'vue';
import VueI18n from 'vue-i18n';

// Import each language here.
import ar from '~/locales/ar.js';
import en from '~/locales/en.js';
import es from '~/locales/es.js';
import fr from '~/locales/fr.js';
import rn from '~/locales/rn.js';
import ru from '~/locales/ru.js';
import so from '~/locales/so.js';
import uk from '~/locales/uk.js';

Vue.use(VueI18n);

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'en',
    messages: {
      'ar': ar,
      'en': en,
      'es': es,
      'fr': fr,
      'rn': rn,
      'ru': ru,
      'so': so,
      'uk': uk,
    }
  });

  app.i18n.path = (link) => {
    // We are explicitly printing language in all cases. If we wanted to have a
    // definitive "default" then we could avoid printing the language code like
    // this:
    //
    // if (app.i18n.locale === app.i18n.fallbackLocale) {
    //   return `/${link}`;
    // }
    return `/${store.state.locale}/${link}`;
  }
}
