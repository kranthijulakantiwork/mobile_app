// @flow

import i18n from 'i18n-js';
import en from 'app/config/locales/en';
import hi from 'app/config/locales/hi';
import te from 'app/config/locales/te';

i18n.fallbacks = true;
i18n.translations = { te, en, hi };

export default i18n;
