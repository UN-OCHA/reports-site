export default function ({ isHMR, app, store, route, params, req, error, redirect }) {
  if (isHMR) { // ignore if called from hot module replacement
    return;
  }

  if (req) {
    if (route.name) {
      let locale = null;

      // Respect the URL if a language is present.
      // if (route.params.lang) {
      //   locale = route.params.lang;
      // }

      // If URL had no language, check if the locale cookie is set.
      // if (!locale && req.headers.cookie) {
      //   const cookies = req.headers.cookie.split('; ').map(stringCookie => stringCookie.split('='));
      //   const cookie = cookies.find(cookie => cookie[0] === 'locale');

      //   if (cookie) {
      //     locale = cookie[1];
      //   }
      // }

      // if the locale cookie is not set, fallback to accept-language header
      if (!locale && !!req.headers['accept-language']) {
        locale = req.headers['accept-language'].split(',')[0].toLocaleLowerCase().substring(0, 2);
      }

      store.commit('SET_LANG', locale);
      app.i18n.locale = store.state.locale;
    }
  }
};
