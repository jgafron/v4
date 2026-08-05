/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// Preload only the critical above-the-fold font files used in nav, hero, and about
// Keep final fonts as Calibre (sans) and SF Mono (mono), with font-display: swap in CSS

exports.onRenderBody = ({ setHeadComponents }) => {
  // Require font assets so Gatsby/webpack resolves their hashed URLs
  try {
    const calibreRegularWoff2 = require('./src/fonts/Calibre/Calibre-Regular.woff2');
    const calibreSemiboldWoff2 = require('./src/fonts/Calibre/Calibre-Semibold.woff2');
    const sfMonoRegularWoff2 = require('./src/fonts/SFMono/SFMono-Regular.woff2');

    setHeadComponents([
      // Calibre Regular 400 (body text in hero/about)
      require('react').createElement('link', {
        key: 'preload-calibre-regular-woff2',
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: calibreRegularWoff2,
        crossOrigin: 'anonymous',
      }),
      // Calibre Semibold 600 (headings)
      require('react').createElement('link', {
        key: 'preload-calibre-semibold-woff2',
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: calibreSemiboldWoff2,
        crossOrigin: 'anonymous',
      }),
      // SF Mono Regular 400 (nav and monospace snippets)
      require('react').createElement('link', {
        key: 'preload-sfmono-regular-woff2',
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: sfMonoRegularWoff2,
        crossOrigin: 'anonymous',
      }),
    ]);
  } catch (e) {
    // If require fails in some environments, skip preloading gracefully
  }
};
