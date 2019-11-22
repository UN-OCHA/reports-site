<template>
  <nuxt/>
</template>

<style lang="scss">
//
// Import shared variables
//
@import '~/assets/Global.scss';

//
// Global, site-wide CSS.
//
// Styles specific to a components should be included inside each .vue file.
//
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

html {
  font-family: system-ui;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  @media screen {
    background: hsl(0, 0%, 97%);
    color: #333;
    padding-top: 2rem;
  }

  @media screen and (min-width: $bkpt-app-bar) {
    padding-top: 0;
  }
}


//
// Drupal 7 — Hide elements from all users.
//
// Used for elements which should not be immediately displayed to any user. An
// example would be a collapsible fieldset that will be expanded with a click
// from a user. The effect of this class can be toggled with the jQuery show()
// and hide() functions.
//
.element-hidden {
  display: none;
}

//
// Drupal 7 — Hide elements visually, but keep them available for screen-readers.
//
// Used for information required for screen-reader users to understand and use
// the site where visual display is undesirable. Information provided in this
// manner should be kept concise, to avoid unnecessary burden on the user.
// "!important" is used to prevent unintentional overrides.
//
.element-invisible {
  position: absolute !important;
  clip: rect(1px 1px 1px 1px); // IE6, IE7
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  height: 1px;

  // extra style added to avoid horizontal overflows
  transform: scale(0);
}

//
// Drupal 7 — keyboard-focusable hidden elements
//
// The .element-focusable class extends the .element-invisible class to allow
// the element to be focusable when navigated to via the keyboard.
//
.element-invisible.element-focusable:active,
.element-invisible.element-focusable:focus {
  position: static !important;
  clip: auto;
  overflow: visible;
  height: auto;
}

//
// Drupal 7 — automatically clear floats.
//
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

//—— Web Fonts —————————————————————————————————————————————————————————————————

/*! system-font.css v2.0.2 | CC0-1.0 License | github.com/jonathantneal/system-font-css */

@font-face {
  font-family: system-ui;
  font-style: normal;
  font-weight: 300;
  src: local(".SFNSText-Light"), local(".HelveticaNeueDeskInterface-Light"), local(".LucidaGrandeUI"), local("Segoe UI Light"), local("Ubuntu Light"), local("Roboto-Light"), local("DroidSans"), local("Tahoma");
}

@font-face {
  font-family: system-ui;
  font-style: italic;
  font-weight: 300;
  src: local(".SFNSText-LightItalic"), local(".HelveticaNeueDeskInterface-Italic"), local(".LucidaGrandeUI"), local("Segoe UI Light Italic"), local("Ubuntu Light Italic"), local("Roboto-LightItalic"), local("DroidSans"), local("Tahoma");
}

@font-face {
  font-family: system-ui;
  font-style: normal;
  font-weight: 400;
  src: local(".SFNSText-Regular"), local(".HelveticaNeueDeskInterface-Regular"), local(".LucidaGrandeUI"), local("Segoe UI"), local("Ubuntu"), local("Roboto-Regular"), local("DroidSans"), local("Tahoma");
}

@font-face {
  font-family: system-ui;
  font-style: italic;
  font-weight: 400;
  src: local(".SFNSText-Italic"), local(".HelveticaNeueDeskInterface-Italic"), local(".LucidaGrandeUI"), local("Segoe UI Italic"), local("Ubuntu Italic"), local("Roboto-Italic"), local("DroidSans"), local("Tahoma");
}

@font-face {
  font-family: system-ui;
  font-style: normal;
  font-weight: 500;
  src: local(".SFNSText-Medium"), local(".HelveticaNeueDeskInterface-MediumP4"), local(".LucidaGrandeUI"), local("Segoe UI Semibold"), local("Ubuntu Medium"), local("Roboto-Medium"), local("DroidSans-Bold"), local("Tahoma Bold");
}

@font-face {
  font-family: system-ui;
  font-style: italic;
  font-weight: 500;
  src: local(".SFNSText-MediumItalic"), local(".HelveticaNeueDeskInterface-MediumItalicP4"), local(".LucidaGrandeUI"), local("Segoe UI Semibold Italic"), local("Ubuntu Medium Italic"), local("Roboto-MediumItalic"), local("DroidSans-Bold"), local("Tahoma Bold");
}

@font-face {
  font-family: system-ui;
  font-style: normal;
  font-weight: 700;
  src: local(".SFNSText-Bold"), local(".HelveticaNeueDeskInterface-Bold"), local(".LucidaGrandeUI"), local("Segoe UI Bold"), local("Ubuntu Bold"), local("Roboto-Bold"), local("DroidSans-Bold"), local("Tahoma Bold");
}

@font-face {
  font-family: system-ui;
  font-style: italic;
  font-weight: 700;
  src: local(".SFNSText-BoldItalic"), local(".HelveticaNeueDeskInterface-BoldItalic"), local(".LucidaGrandeUI"), local("Segoe UI Bold Italic"), local("Ubuntu Bold Italic"), local("Roboto-BoldItalic"), local("DroidSans-Bold"), local("Tahoma Bold");
}

// DOWNLOAD URL: https://google-webfonts-helper.herokuapp.com/fonts/roboto?subsets=latin
// roboto-regular - latin
@font-face {
  font-display: swap;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto'),
       local('Roboto-Regular'),
       url('/fonts/roboto-v18-latin-regular.woff2') format('woff2'),
       url('/fonts/roboto-v18-latin-regular.woff') format('woff');
}

// roboto-italic - latin
// @font-face {
//   font-display: swap;
//   font-family: 'Roboto';
//   font-style: italic;
//   font-weight: 400;
//   src: local('Roboto Italic'),
//        local('Roboto-Italic'),
//        url('/fonts/roboto-v18-latin-italic.woff2') format('woff2'),
//        url('/fonts/roboto-v18-latin-italic.woff') format('woff');
// }

// roboto-700 - latin
@font-face {
  font-display: swap;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Bold'),
       local('Roboto-Bold'),
       url('/fonts/roboto-v18-latin-700.woff2') format('woff2'),
       url('/fonts/roboto-v18-latin-700.woff') format('woff');
}

// DOWNLOAD URL: https://google-webfonts-helper.herokuapp.com/fonts/roboto-condensed?subsets=latin
// roboto-condensed-regular - latin
@font-face {
  font-display: swap;
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto Condensed'),
       local('RobotoCondensed-Regular'),
       url('/fonts/roboto-condensed-v16-latin-regular.woff2') format('woff2'),
       url('/fonts/roboto-condensed-v16-latin-regular.woff') format('woff');
}

// roboto-condensed-italic - latin
// @font-face {
//   font-display: swap;
//   font-family: 'Roboto Condensed';
//   font-style: italic;
//   font-weight: 400;
//   src: local('Roboto Condensed Italic'),
//        local('RobotoCondensed-Italic'),
//        url('/fonts/roboto-condensed-v16-latin-italic.woff2') format('woff2'),
//        url('/fonts/roboto-condensed-v16-latin-italic.woff') format('woff');
// }

// roboto-condensed-700 - latin
@font-face {
  font-display: swap;
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Condensed Bold'),
       local('RobotoCondensed-Bold'),
       url('/fonts/roboto-condensed-v16-latin-700.woff2') format('woff2'),
       url('/fonts/roboto-condensed-v16-latin-700.woff') format('woff');
}

// Noto Kufi Arabic
// @see https://www.google.com/get/noto/#kufi-arab
@font-face {
  font-display: swap;
  font-family: 'Kufi';
  font-style: normal;
  font-weight: 400;
  src: local('NotoKufiArabic Regular'),
       local('NotoKufiArabic-Regular'),
       url('/fonts/notokufiarabic-regular.ttf') format('woff');
}

// Noto Kufi Arabic Bold
// @see https://www.google.com/get/noto/#kufi-arab
@font-face {
  font-display: swap;
  font-family: 'Kufi Bold';
  font-style: normal;
  font-weight: 400;
  src: local('NotoKufiArabic Bold'),
       local('NotoKufiArabic-Bold'),
       url('/fonts/notokufiarabic-bold.ttf') format('woff');
}

// Dubai Medium
@font-face {
  font-display: swap;
  font-family: 'Dubai Regular';
  font-style: normal;
  font-weight: 400;
  src: local('DubaiW23 Regular'),
       local('DubaiW23-Regular'),
       url('/fonts/dubaiw23-regular.woff2') format('woff2'),
       url('/fonts/dubaiw23-regular.woff') format('woff');
}

//—— Site Container ————————————————————————————————————————————————————————————

// This class is generated by Vue/Nuxt
#__layout {
  font-family: $roboto;

  // If we do font-replacement on the HTML tag, it messes with `rem` units.
  // We could refactor a lot of components to avoid use of a flexible unit that
  // was previously assumed constant, but in the mean time the font can be
  // declared here.
  [lang="ar"] & {
    font-family: $dubai;
  }

  @media screen {
    max-width: 1080px;
    margin: 0 1rem;
  }

  @media screen and (min-width: $bkpt-app-bar) {
    margin-left: 5rem;

    [dir="rtl"] & {
      margin-left: 1rem;
      margin-right: 5rem;
    }
  }

  // Reset everything once we hit max and allow the .container elements to move
  // to the right or left depending on reading direction.
  @media screen and (min-width: $bkpt-grid-max) {
    margin-left: auto;
    margin-right: auto;

    [dir="rtl"] & {
      margin-left: auto;
      margin-right: auto;
    }
  }
}

//—— Layout Containers —————————————————————————————————————————————————————————

.container {
  width: 100%;
  margin: 2rem 0;
  padding: 0;
  background-color: transparent;
  box-shadow: none;

  @media screen and (min-width: $bkpt-app-bar) {
    margin: 1rem 0;
  }

  // Since #__layout is doing the actual layout, we nudge the containers a bit
  // to one side depending on reading direction in order to horizontally center
  // them perfectly within the gray space (NOT including AppBar width)
  @media screen and (min-width: $bkpt-grid-max) {
    [dir="ltr"] & {
      margin-left: 2rem
    }

    [dir="rtl"] & {
      margin-right: 2rem;
    }
  }
}


//—— General content ———————————————————————————————————————————————————————————

main {
  display: block; // IE11 fix
}
main img {
  max-width: 100%;
}
main ul {
  margin: 0;
  padding: 1em 0 0 1.5em;

  [dir="rtl"] & {
    padding-left: 0;
    padding-right: 1.5em;
  }
}
main li {
}
main a {
  color: #4c8cca;
}
main code {
  display: inline-block;
  padding: 0 .25em;
  background-color: #eee;
  color: black;
  border-radius: 3px;
}

//—— Rich Text —————————————————————————————————————————————————————————————————

.rich-text {
  // DSR-233: right edge of text was getting cut off in Chrome using Dubai font.
  [lang="ar"] & {
    padding-right: 2px;
  }
}
.rich-text * {
  margin-bottom: 1em;
}
.rich-text *:last-child {
  margin-bottom: 0;
}
.rich-text p {
  line-height: 1.5;
  margin-bottom: 1em;
}
.rich-text p img {
  display: block;
  margin: 1em 0;
}
.rich-text ul,
.rich-text ol {
  margin-top: 0;
  margin-bottom: 1em;
  padding: 0;

  [dir="ltr"] & {
    margin-left: 2em;
    margin-right: 1em;
  }

  [dir="rtl"] & {
    margin-left: 1em;
    margin-right: 2em;
  }
}
.rich-text li {
  margin-bottom: .5em;
}
.rich-text li:last-child {
  margin-bottom: 0;
}

//—— Captioned Images ——————————————————————————————————————————————————————————

figure img {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
  border-radius: 5px;
}

figure img ~ figcaption,
figure picture ~ figcaption {
  margin: .25cm;
  color: #444;
  background: none;
  font-size: .9em;
  font-style: italic;
}

@media print {
  figure {
    page-break-inside: avoid;
  }
}

//—— Buttons ———————————————————————————————————————————————————————————————————

.btn {
  display: inline-block;
  padding: 0;
  width: 1rem;
  height: 1rem;
  border: 0;
  margin: 0;
  opacity: 1;
  cursor: pointer;
  background-color: transparent;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  transform: scale(1); /* baseline for animations */
  transition: .3333s ease-out;
  transition-property: opacity, transform;
}

.btn:hover {
  opacity: .8;
  transition: opacity .1666s ease-out;
}

.btn--is-active {
  animation: is-active 1s ease-in-out infinite;
  cursor: wait;
}

@keyframes is-active {
  50% {
    transform: scale(1.3333);
  }
}

//—— Print —————————————————————————————————————————————————————————————————————

@media print {
  body {
    //
    // Correct the colors on the printouts using Snap Service (Puppeteer).
    //
    -webkit-print-color-adjust: exact;

    background-color: white;
    font-size: 10pt !important;
    padding: 0 10mm;
  }

  .container {
    margin: 0;
  }

  main p {
    orphans: 3;
    widows: 3;
  }

  //
  // Print URLs during Snaps
  //
  .snap--print-urls {
    .rich-text a[href] {
      text-decoration: none;

      &::after {
        content: " <" attr(href) "> ";
      }
    }
  }

  //
  // If the [href] starts with a hash, the printout cannot contain a meaningful
  // destination. Hide it.
  //
  .rich-text a[href^="#"] {
    display: none;

    &::after {
      content: none;
    }
  }
}

//—— Card ——————————————————————————————————————————————————————————————————————

.card {
  margin: 0;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 7px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  position: relative;

  @media print {
    box-shadow: none;
    border-radius: 0;
    border-bottom: 1px solid #ddd;
    padding: 0 0 1rem 0;
  }

  @media screen {
    &:focus {
      outline: none;
      box-shadow: 0 0 0 4px $main-blue;
    }
  }
}

.card__title {
  display: block;
  margin-bottom: 1rem;
  color: #444;
  font-family: $roboto-condensed;
  font-weight: 700;
  font-size: 17px;
  text-transform: uppercase;

  [lang="ar"] & {
    font-family: $kufi-bold;
    line-height: 1;
  }
}

.card__time-ago {
  display: inline-block;
  margin-left: .5em;
  opacity: .8;
  font-weight: 400;
  text-transform: none;
  cursor: pointer;

  [lang="ar"] & {
    font-family: $kufi;
    line-height: 1;
  }
}

//
// Snap Service: cancel border-radius so we get a perfect rectangle graphic.
//
.snap--png .card {
  border-radius: 0;
  box-shadow: none;
}



//—— Animations—————————————————————————————————————————————————————————————————

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}


//—— DevTools ——————————————————————————————————————————————————————————————————

pre {
  clear: both;
  background: repeating-linear-gradient(to right, #eee 0, #eee 15px, #ddd 15px, #ddd 30px);
}

</style>
