module.exports = {
    setActivePage: (page) => (req, res, next) => {
        res.locals.activePage = page;
        next();
    },
    setTranslations: (req, res, next) => {
        const langCode = req.cookies.language || 'en';
        try {
            res.locals.translations = require(`../locales/${langCode}.json`);
        } catch {
            res.locals.translations = require('../locales/en.json');
        }
        next();
    },
};
