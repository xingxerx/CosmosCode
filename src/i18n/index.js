const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');

// Initialize i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.json')
    },
    fallbackLng: 'en',
    preload: ['en', 'es', 'fr', 'zh'],
    saveMissing: true,
    debug: process.env.NODE_ENV === 'development'
  });

// Express middleware
const i18nMiddleware = middleware.handle(i18next);

// React context provider setup
const setupI18n = (app) => {
  app.use(i18nMiddleware);
  
  // API endpoint to get translations
  app.get('/api/translations/:lng/:ns', (req, res) => {
    const { lng, ns } = req.params;
    res.json(i18next.getResourceBundle(lng, ns));
  });
  
  return app;
};

module.exports = {
  i18nMiddleware,
  setupI18n,
  t: i18next.t.bind(i18next)
};